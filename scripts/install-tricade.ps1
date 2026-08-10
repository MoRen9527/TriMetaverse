# install-tricade.ps1
# TriCade 统一安装脚本
# 整合所有版本脚本的共同模式，参数化版本和路径
#
# 用法：
#   .\install-tricade.ps1 -MsiPath <path>                    # 基本 MSI 安装
#   .\install-tricade.ps1 -MsiPath <path> -InstallService     # MSI + NSSM 服务注册
#   .\install-tricade.ps1 -ZipPath <path>                     # ZIP 解压安装（开发版）
#   .\install-tricade.ps1 -MsiPath <path> -SkipVerify         # 跳过验证（加速）
#   .\install-tricade.ps1 -MsiPath <path> -SkipStop           # 跳过停止进程（全新安装）
#   .\install-tricade.ps1 -MsiPath <path> -WhatIf             # 干跑
#   .\install-tricade.ps1 -MigrateLegacy -MsiPath <path>      # 迁移旧目录（TriMetaverse\TriCade → TriCade）
#
# 注意：必须以管理员身份运行

param(
    [string]$MsiPath,                          # MSI 文件路径（与 ZipPath 二选一）
    [string]$ZipPath,                          # ZIP 文件路径（与 MsiPath 二选一）
    [switch]$InstallService,                   # 安装后注册为 NSSM Windows 服务
    [string]$ServiceName = "TriLC",            # 服务名称
    [int]$ServicePort = 8711,                  # 服务端口
    [switch]$SkipStop,                         # 跳过停止现有进程
    [switch]$SkipVerify,                       # 跳过安装后验证
    [switch]$SkipHealthz,                      # 跳过 /healthz 检查
    [switch]$MigrateLegacy,                    # 迁移旧安装（清孤儿目录 + PATH）
    [switch]$WhatIf                            # 干跑模式
)

$ErrorActionPreference = "Stop"
$ScriptVersion = "1.0.0"

# ── 常量 ──
# Tool identity install dir (stable across projects — see tricade.wxs INSTALLFOLDER)
$InstallDir = "C:\Program Files\TriCade"
$TriLCDir   = "$InstallDir\trilc"
$Version    = ""  # 自动从 MSI/ZIP 文件名提取

# ── 工具函数 ──

function Write-Step {
    param([string]$Msg, [string]$Color = "Yellow")
    Write-Host "`n[$($MyInvocation.ScriptLineNumber)] $Msg" -ForegroundColor $Color
}

function Write-Ok  { Write-Host "  [OK] $args" -ForegroundColor Green }
function Write-Warn { Write-Host "  [!] $args" -ForegroundColor Yellow }
function Write-Fail { Write-Host "  [X] $args" -ForegroundColor Red }
function Write-Info { Write-Host "       $args" -ForegroundColor DarkGray }

function Extract-Version {
    param([string]$Path)
    if ($Path -match '(\d+\.\d+\.\d+)') {
        return $Matches[1]
    }
    return "unknown"
}

function Test-Admin {
    $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-not $isAdmin) {
        Write-Fail "需要管理员权限。右键 -> 以管理员身份运行 PowerShell"
        Read-Host "按回车退出"
        exit 1
    }
    Write-Ok "管理员权限已确认"
}

function Invoke-LegacyMigration {
    Write-Step "迁移旧安装（TriMetaverse\TriCade → TriCade）"

    $legacyDir = "C:\Program Files\TriMetaverse\TriCade"
    $legacyRoot = "C:\Program Files\TriMetaverse"
    $orphanDir = "C:\Program Files\TriCade"
    $serviceName = "TriLC"
    $runKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"

    # 1. 停旧 daemon（RegRun + schtasks + 进程）
    Write-Info "停止旧 daemon 注册..."
    if ($WhatIf) { Write-Info "(WhatIf) 将删除 HKCU Run 的 TriLC 条目 + 停止 TriLC 进程"; return }

    try { reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v TriLC /f 2>$null | Out-Null } catch { }
    Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like '*trilc*' } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    Start-Sleep -Seconds 2

    # 2. 删除 schtasks 任务（如存在）
    try {
        schtasks /query /tn "TriLC Daemon" 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Info "删除 schtasks: TriLC Daemon"
            schtasks /delete /tn "TriLC Daemon" /f | Out-Null
        } else {
            Write-Info "schtasks: TriLC Daemon 不存在，跳过"
        }
    } catch {
        Write-Info "schtasks: TriLC Daemon 不存在，跳过"
    }

    # 3. 清理旧 MSI 目录（TriMetaverse\TriCade — MSI 卸载会处理，此处兜底）
    if (Test-Path $legacyDir) {
        Write-Info "旧 MSI 目录存在: $legacyDir（新 MSI 安装时 MajorUpgrade 会卸载）"
    }

    # 4. 清孤儿目录（C:\Program Files\TriCade — 脚本时代残留，无 MSI 所有者）
    if (Test-Path $orphanDir) {
        Write-Warn "发现孤儿目录: $orphanDir（脚本部署残留，非 MSI 所有）"
        $confirm = Read-Host "  删除孤儿目录? (y/n)"
        if ($confirm -eq 'y') {
            Remove-Item -Recurse -Force $orphanDir
            Write-Ok "孤儿目录已删除"
        } else {
            Write-Warn "跳过孤儿目录删除 — 新 MSI 文件将与旧文件交错，风险自负"
        }
    }

    # 5. 清理机器 PATH 里的旧条目
    $machinePath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    $pathEntries = $machinePath -split ";" | Where-Object { $_ -ne "" }
    $filtered = $pathEntries | Where-Object {
        $_ -notlike "*TriCade*bin*" -and $_ -notlike "*TriMetaverse*" -and $_ -notlike "*resources\app\tools*"
    }
    $newPath = $filtered -join ";"
    if ($machinePath -ne $newPath) {
        Write-Info "清理机器 PATH 旧条目..."
        [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
        Write-Ok "PATH 已清理（新 shell 生效）"
    } else {
        Write-Info "PATH 无旧条目"
    }

    Write-Ok "迁移预清理完成。继续安装新版本..."
}

function Stop-TriCadeProcesses {
    if ($SkipStop) {
        Write-Info "(-SkipStop) 跳过停止进程"
        return
    }

    Write-Step "停止现有 TriCade / trilc 进程"

    $tricade = Get-Process tricade -ErrorAction SilentlyContinue
    $trilcNodes = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like '*trilc*' }

    if (-not $tricade -and -not $trilcNodes) {
        Write-Info "没有正在运行的 TriCade/trilc 进程"
        return
    }

    if ($tricade) {
        if ($WhatIf) { Write-Info "(WhatIf) 将停止 tricade.exe"; return }
        $tricade | Stop-Process -Force
        Write-Ok "已停止 tricade.exe"
    }
    if ($trilcNodes) {
        if ($WhatIf) { Write-Info "(WhatIf) 将停止 trilc node 进程"; return }
        $trilcNodes | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
        Write-Ok "已停止 trilc node 进程"
    }
    Start-Sleep -Seconds 2
}

function Install-FromMSI {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        Write-Fail "MSI 不存在: $Path"
        exit 1
    }

    Write-Step "安装 MSI: $Version"
    Write-Info "路径: $Path"

    $log = "$env:TEMP\tricade-$Version-install.log"

    if ($WhatIf) {
        Write-Info "(WhatIf) msiexec /i `"$Path`" /qn /norestart /L*v `"$log`""
        return $true
    }

    $p = Start-Process msiexec.exe `
        -ArgumentList "/i `"$Path`" /qn /norestart /L*v `"$log`"" `
        -Wait -PassThru

    if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
        Write-Fail "msiexec 失败 (exit=$($p.ExitCode))"
        Write-Info "安装日志: $log"
        Read-Host "按回车退出"
        exit $p.ExitCode
    }

    Write-Ok "MSI 安装完成 (exit=$($p.ExitCode))"
    Write-Info "安装日志: $log"
    return $true
}

function Install-FromZip {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        Write-Fail "ZIP 不存在: $Path"
        exit 1
    }

    Write-Step "解压 ZIP: $Version"

    $staging = "$env:TEMP\tricade-$Version-staging"

    if (Test-Path $staging) { Remove-Item -Recurse -Force $staging }
    New-Item -ItemType Directory -Force -Path $staging | Out-Null

    if ($WhatIf) {
        Write-Info "(WhatIf) Expand-Archive `"$Path`" `"$staging`""
        return $true
    }

    Expand-Archive -Force -Path $Path -DestinationPath $staging
    Write-Ok "ZIP 已解压到: $staging"

    # 复制 trilc 目录到安装位置
    $src = "$staging\trilc"
    if (-not (Test-Path $src)) {
        # 尝试查找 staging 内的子目录
        $subDirs = Get-ChildItem $staging -Directory | Select-Object -First 1
        $src = "$($subDirs.FullName)\trilc"
    }

    if (-not (Test-Path $src)) {
        Write-Fail "ZIP 中未找到 trilc 目录"
        exit 1
    }

    if (-not (Test-Path $InstallDir)) {
        New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    }

    $dst = $TriLCDir
    if (Test-Path $dst) {
        $bak = "$dst.bak-$((Get-Date -Format 'yyyyMMdd-HHmmss'))"
        Write-Info "备份现有: $bak"
        Move-Item $dst $bak
    }

    Copy-Item -Recurse -Force $src $dst
    Write-Ok "trilc 已复制到: $dst"

    # 清理 staging
    Remove-Item -Recurse -Force $staging -ErrorAction SilentlyContinue
    return $true
}

function Invoke-Verify {
    if ($SkipVerify) {
        Write-Info "(-SkipVerify) 跳过验证"
        return
    }

    Write-Step "验证安装"

    # 基础文件
    $files = @(
        "$TriLCDir\dist\cli.js",
        "$TriLCDir\dist\server\app.js",
        "$TriLCDir\package.json"
    )
    foreach ($f in $files) {
        if ($WhatIf) { Write-Info "(WhatIf) Test-Path $f"; continue }
        $ok = Test-Path $f
        $label = ($f -replace [regex]::Escape($TriLCDir), "").TrimStart("\")
        if ($ok) { Write-Ok "$label" }
        else { Write-Fail "$label 缺失" }
    }

    # ARP 注册（仅 MSI）
    if ($MsiPath) {
        $arp = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
            "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" `
            -ErrorAction SilentlyContinue |
            Where-Object { $_.DisplayName -like '*TriCade*' } |
            Select-Object DisplayName, DisplayVersion -First 1
        if ($arp) {
            Write-Ok "ARP: $($arp.DisplayName) v$($arp.DisplayVersion)"
        } else {
            Write-Warn "ARP 未找到 TriCade 条目（Base 可能未安装）"
        }
    }
}

function Invoke-Healthz {
    if ($SkipHealthz) {
        Write-Info "(-SkipHealthz) 跳过健康检查"
        return
    }

    Write-Step "健康检查 (/healthz)"

    $portLines = netstat -ano | Select-String ":$ServicePort\s+.*LISTENING"
    if (-not $portLines) {
        Write-Warn "端口 $ServicePort 未监听（服务可能未启动）"
        return
    }

    $listenAddr = ($portLines[0].Line -split "\s+")[1]
    Write-Info "监听: $listenAddr`:$ServicePort"

    try {
        $resp = Invoke-RestMethod -Uri "http://127.0.0.1:$ServicePort/healthz" -TimeoutSec 5 -ErrorAction Stop
        if ($resp.ok) {
            Write-Ok "/healthz: ok=$($resp.ok) service=$($resp.service) uptime=$($resp.uptime)s"
        } else {
            Write-Warn "/healthz: ok=false"
        }
    } catch {
        Write-Warn "/healthz 请求失败: $($_.Exception.Message)"
        Write-Info "这可能是正常的——服务刚启动，等几秒再试"
    }
}

function Install-TriLCService {
    if (-not $InstallService) {
        Write-Info "(未指定 -InstallService) 跳过服务注册"
        return
    }

    Write-Step "注册 TriLC Windows 服务"

    # 查找 trilc.cmd
    $trilcCmd = "$TriLCDir\trilc.cmd"
    if (-not (Test-Path $trilcCmd)) {
        Write-Fail "trilc.cmd 不存在: $trilcCmd"
        return
    }

    if ($WhatIf) {
        Write-Info "(WhatIf) & $trilcCmd install-regrun"
        return
    }

    # 注册自动启动
    & $trilcCmd install-regrun 2>&1 | ForEach-Object { Write-Info $_ }
    Write-Ok "已配置登录自动启动 (RegRun)"

    # 如果 NSSM 可用，注册为 Windows 服务
    $nssm = "D:\Code\ai\TriMetaverse\tools\nssm\nssm.exe"
    if (Test-Path $nssm) {
        Write-Info "NSSM 已检测，注册 Windows 服务..."

        # 停止现有服务
        & $nssm stop $ServiceName 2>$null | Out-Null

        # 查找 node.exe
        $nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
        if (-not $nodePath) { $nodePath = "C:\Program Files\nodejs\node.exe" }

        # 安装服务
        & $nssm install $ServiceName $nodePath
        & $nssm set $ServiceName AppParameters "`"$TriLCDir\dist\cli.js`" run"
        & $nssm set $ServiceName AppDirectory $TriLCDir
        & $nssm set $ServiceName AppThrottle 5000
        & $nssm set $ServiceName AppStopMethodSkip 6
        & $nssm set $ServiceName AppExit Default Restart
        & $nssm set $ServiceName Description "TriLC Local Controller Daemon"
        & $nssm set $ServiceName Start SERVICE_AUTO_START

        & $nssm start $ServiceName
        Write-Info "等待 daemon 初始化 (8s)..."
        Start-Sleep 8

        $status = & $nssm status $ServiceName
        if ($status -match "RUNNING") {
            Write-Ok "NSSM 服务状态: $status"
        } else {
            Write-Warn "NSSM 服务状态: $status（可能还在初始化）"
        }

        # sc 服务详情
        Write-Info "服务配置:"
        sc.exe qc $ServiceName 2>&1 | Select-String "BINARY_PATH_NAME|START_TYPE|SERVICE_START_NAME" | ForEach-Object { Write-Info $_.Line.Trim() }
    } else {
        Write-Info "NSSM 未检测（$nssm 不存在），跳过 Windows 服务注册"
        Write-Info "手动注册: trilc daemon install"
    }
}

function Show-Completion {
    Write-Host "`n==============================================" -ForegroundColor Cyan
    Write-Host " TriCade $Version 安装完成" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Cyan

    Write-Host ""
    Write-Host "  安装目录: $TriLCDir" -ForegroundColor Cyan
    Write-Host "  版本: $Version" -ForegroundColor Cyan

    if ($MsiPath) {
        $msiSize = [math]::Round((Get-Item $MsiPath).Length / 1MB, 1)
        Write-Host "  MSI: $MsiPath ($msiSize MB)" -ForegroundColor DarkGray
    }

    Write-Host ""
    Write-Host "  快速开始:" -ForegroundColor Magenta
    Write-Host "    trilc daemon start          # 启动 daemon"
    Write-Host "    trilc daemon status         # 查看状态"
    Write-Host "    curl http://127.0.0.1:8711/healthz  # 健康检查"
    Write-Host ""

    if (-not $InstallService -and (Test-Path "$TriLCDir\trilc.cmd")) {
        Write-Host "  注册为 Windows 服务:" -ForegroundColor Magenta
        Write-Host "    trilc daemon install        # 安装服务 + 开机自启"
        Write-Host ""
    }

    Write-Host "  重新运行本脚本加 -InstallService 可自动完成服务注册。" -ForegroundColor DarkGray
}

# ═══════════════════════════════════════════════════════════════════
# 主流程
# ═══════════════════════════════════════════════════════════════════

Write-Host "=== TriCade 统一安装脚本 v$ScriptVersion ===" -ForegroundColor Cyan

# Phase 0: 预检
Test-Admin

if ($MsiPath) {
    $Version = Extract-Version -Path $MsiPath
}
elseif ($ZipPath) {
    $Version = Extract-Version -Path $ZipPath
}
else {
    Write-Fail "必须指定 -MsiPath 或 -ZipPath"
    Write-Host "  用法: .\install-tricade.ps1 -MsiPath <path> [-InstallService] [-WhatIf]"
    exit 1
}

Write-Info "目标版本: $Version"
Write-Info "安装模式: $(if($MsiPath){'MSI'}else{'ZIP'})"
if ($WhatIf) { Write-Warn "干跑模式 — 不执行实际操作" }

# Phase 0.5: 迁移旧安装（可选）
if ($MigrateLegacy) {
    Invoke-LegacyMigration
}

# Phase 1: 停止
Stop-TriCadeProcesses

# Phase 2: 安装
if ($MsiPath) {
    Install-FromMSI -Path $MsiPath
} else {
    Install-FromZip -Path $ZipPath
}

# Phase 3: 验证
Invoke-Verify

# Phase 4: 服务注册
Install-TriLCService

# Phase 5: 健康检查
Invoke-Healthz

# Phase 6: 完成
Show-Completion
