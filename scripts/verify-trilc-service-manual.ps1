# verify-trilc-service-manual.ps1
# 手动用正确 sc 引号格式验证服务化链路（绕过 cli.ts binPath bug）
# 用法：右键 -> 以管理员身份运行 PowerShell，执行本脚本
$ErrorActionPreference = "Stop"

# ── 0. 管理员检查 ──
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] 需要管理员权限。右键 -> 以管理员身份运行 PowerShell。" -ForegroundColor Red; pause; exit 1 }

$node = "C:\Program Files\nodejs\node.exe"
$cli  = "C:\Program Files\TriCade\resources\app\tools\trirlc\dist\cli.js"
$name = "TriRLC"

if (-not (Test-Path $node)) { Write-Host "[X] node 不在: $node" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $cli))  { Write-Host "[X] trilc cli.js 不在（0.2.8 没装？）: $cli" -ForegroundColor Red; pause; exit 1 }

# 若服务已存在，先清理
$existing = & sc.exe query $name 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[0] 清理已存在的服务 $name..." -ForegroundColor Yellow
    & sc.exe stop $name 2>$null | Out-Null
    Start-Sleep 2
    & sc.exe delete $name 2>$null | Out-Null
    Start-Sleep 2
}

# ── 1. 用正确引号格式 sc create（经 cmd /c，避免 PowerShell 引号冲突）──
Write-Host "`n[1/5] sc create（正确 binPath 引号，经 cmd）..." -ForegroundColor Yellow
# sc 的 binPath 值要整体一个引号包，内部路径用 \" 转义。
# PowerShell 直接调 sc 会剥外层引号，必须经 cmd /c。
$binPathVal = '\"' + $node + '\" \"' + $cli + '\" run'
$scCmd = "sc create $name binPath= `"$binPathVal`" start= delayed-auto"
Write-Host "  执行: $scCmd"
cmd /c $scCmd
if ($LASTEXITCODE -ne 0) { Write-Host "[X] sc create 失败 exit=$LASTEXITCODE" -ForegroundColor Red; pause; exit 1 }
Write-Host "  [OK] 服务创建" -ForegroundColor Green

# ── 2. 配置 failure recovery + description ──
Write-Host "`n[2/5] 配置 failure recovery..." -ForegroundColor Yellow
& sc.exe description $name "TriRLC - AI-powered local agent daemon" | Out-Null
& sc.exe failure $name reset= 86400 actions= restart/60000/restart/60000/restart/60000 | Out-Null
Write-Host "  [OK] 崩溃 60s 自动重启 x3" -ForegroundColor Green

# ── 3. 启动服务 ──
Write-Host "`n[3/5] sc start..." -ForegroundColor Yellow
& sc.exe start $name
Start-Sleep 5
$status = (& sc.exe query $name) -join ""
if ($status -match "RUNNING") { Write-Host "  [OK] 服务 RUNNING" -ForegroundColor Green }
else { Write-Host "  [!] 服务未 RUNNING，状态:" -ForegroundColor Red; & sc.exe query $name }

# ── 4. 运行时验证 ──
Write-Host "`n[4/5] 运行时验证..." -ForegroundColor Yellow
Start-Sleep 3
# 端口监听
$listen = (netstat -ano | Select-String ":8711.*LISTENING")
if ($listen) {
    Write-Host "  [OK] 8711 监听: $($listen.Line.Trim())" -ForegroundColor Green
    # 监听面检查
    if ($listen.Line -match "0\.0\.0\.0|::") { Write-Host "  [WARN] 绑定 0.0.0.0/::（LAN 可达，S2 需改 127.0.0.1）" -ForegroundColor Yellow }
    else { Write-Host "  [OK] 仅 localhost" -ForegroundColor Green }
} else { Write-Host "  [!] 8711 未监听" -ForegroundColor Red }

# healthz
try {
    $h = Invoke-RestMethod "http://127.0.0.1:8711/healthz" -TimeoutSec 5
    Write-Host "  [OK] /healthz: $($h | ConvertTo-Json -Compress)" -ForegroundColor Green
} catch { Write-Host "  [!] /healthz 失败: $_" -ForegroundColor Red }

# 进程身份
$svcPid = (Get-CimInstance Win32_Service -Filter "Name='$name'").ProcessId
if ($svcPid) {
    $owner = (Get-Process -Id $svcPid).Name
    Write-Host "  [OK] 服务 PID=$svcPid ($owner)" -ForegroundColor Green
}

# ── 5. 崩溃恢复测试 ──
Write-Host "`n[5/5] 崩溃恢复测试（taskkill，看 failure recovery 自动重启）..." -ForegroundColor Yellow
$svcPid = (Get-CimInstance Win32_Service -Filter "Name='$name'").ProcessId
Write-Host "  杀进程 PID=$svcPid..."
Stop-Process -Id $svcPid -Force
Write-Host "  等待 75s 看自动重启..." -ForegroundColor Cyan
$restarted = $false
for ($i=0; $i -lt 15; $i++) {
    Start-Sleep 5
    $newPid = (Get-CimInstance Win32_Service -Filter "Name='$name'").ProcessId
    if ($newPid -and $newPid -ne 0 -and $newPid -ne $svcPid) {
        Write-Host "  [OK] 自动重启成功！新 PID=$newPid（耗时 ~$($i*5+5)s）" -ForegroundColor Green
        $restarted = $true
        break
    }
}
if (-not $restarted) { Write-Host "  [!] 75s 内未自动重启" -ForegroundColor Yellow }

# ── 汇总 ──
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " 验证完成。" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "服务 $name 当前状态:"
& sc.exe query $name
Write-Host ""
Write-Host "回滚（删服务）: 管理员跑 sc stop TriRLC; sc delete TriRLC" -ForegroundColor Cyan
Write-Host "或保留服务试用（开机自启，关 TriCade 不影响）" -ForegroundColor Cyan
pause
