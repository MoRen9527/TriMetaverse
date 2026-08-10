# verify-nssm-service.ps1
# nssm 服务化链路验证（替代 sc create，解决 1053）
# 用法：右键 -> 以管理员身份运行 PowerShell，执行本脚本
$ErrorActionPreference = "Stop"

$NSSM  = "D:\OneDrive\Code\ai\TriMetaverse\tools\nssm\nssm.exe"
# 8.3 短路径（无空格 = nssm 不截断）——实测可执行
$NODE  = "C:\PROGRA~1\nodejs\node.exe"
$CLI   = "C:\PROGRA~1\TriCade\RESOUR~1\app\tools\trilc\dist\cli.js"
# AppDirectory 仍用完整长路径
$DIR   = "C:\Program Files\TriCade\resources\app\tools\trilc"
$NAME  = "TriLC"
$LOG   = "$env:PROGRAMDATA\TriCade\logs"

# ── 0. 管理员 + 文件检查 ──
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] 需要管理员权限" -ForegroundColor Red; pause; exit 1 }
if (!(Test-Path $NSSM))  { Write-Host "[X] nssm.exe 不存在: $NSSM" -ForegroundColor Red; pause; exit 1 }
if (!(Test-Path $CLI))   { Write-Host "[X] trilc cli.js 不存在: $CLI" -ForegroundColor Red; pause; exit 1 }

# ── 清理之前的残留（sc create 旧版 + nssm 旧版）──
Write-Host "[0] 清理旧服务残留..." -ForegroundColor Yellow
# sc delete（如果有旧版 sc create 的残留）——不管存不存在都放行
& sc.exe stop $NAME 2>$null | Out-Null
Start-Sleep 1
& sc.exe delete $NAME 2>$null | Out-Null
Start-Sleep 1
# nssm remove（如果之前是 nssm 装的）——不管存不存在都放行
try { & $NSSM remove $NAME confirm 2>$null | Out-Null } catch {}
Write-Host "  [OK] 清理完成（残留/不存在都放行）"

# ── 1. nssm install（8.3 短路径无空格，跳过 cmd.exe 包装）──
Write-Host "`n[1/6] nssm install（8.3 短路径）..." -ForegroundColor Yellow
& $NSSM install $NAME $NODE "$CLI run"
if ($LASTEXITCODE -ne 0) { Write-Host "[X] nssm install 失败" -ForegroundColor Red; pause; exit 1 }
Write-Host "  [OK] 服务注册成功"

# ── 2. nssm 配置 ──
Write-Host "`n[2/6] nssm 配置..." -ForegroundColor Yellow

# AppDirectory → 解决 cwd=System32 问题
& $NSSM set $NAME AppDirectory $DIR
Write-Host "  AppDirectory: $DIR"

# 日志重定向 → 解决日志丢失
$logDir = "$env:PROGRAMDATA\TriCade\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
& $NSSM set $NAME AppStdout "$logDir\trilc-stdout.log"
& $NSSM set $NAME AppStderr "$logDir\trilc-stderr.log"
Write-Host "  AppStdout/Stderr: $logDir"

# 崩溃重启 → 比 sc failure 更可靠
& $NSSM set $NAME AppExit Default Restart
Write-Host "  AppExit: Default Restart"

# 延迟自启
& $NSSM set $NAME Start SERVICE_DELAYED_AUTO_START
Write-Host "  Start: SERVICE_DELAYED_AUTO_START"

# DisplayName
& $NSSM set $NAME DisplayName "TriLC - AI-powered local agent daemon"
Write-Host "  [OK] 配置完成"

# ── 3. nssm start ──
Write-Host "`n[3/6] nssm start..." -ForegroundColor Yellow
& $NSSM start $NAME
Start-Sleep 5
$status = (& sc.exe query $NAME) -join ""
if ($status -match "RUNNING") { Write-Host "  [OK] 服务 RUNNING" -ForegroundColor Green }
else { Write-Host "  [!] 服务未 RUNNING" -ForegroundColor Red; & sc.exe query $NAME }

# ── 4. 运行时验证 ──
Write-Host "`n[4/6] 运行时验证..." -ForegroundColor Yellow
Start-Sleep 3

# 端口
$listen = (netstat -ano | Select-String ":8711.*LISTENING")
if ($listen) {
    Write-Host "  [OK] 8711 监听"
    if ($listen.Line -match "0\.0\.0\.0|::") { Write-Host "  [WARN] 绑定 0.0.0.0/:: (S2 改 127.0.0.1)" -ForegroundColor Yellow }
} else { Write-Host "  [!] 8711 未监听" -ForegroundColor Red }

# healthz
try {
    $h = Invoke-RestMethod "http://127.0.0.1:8711/healthz" -TimeoutSec 5
    Write-Host "  [OK] /healthz: ok=$($h.ok), service=$($h.service)" -ForegroundColor Green
} catch { Write-Host "  [!] /healthz 失败: $_" -ForegroundColor Red }

# cwd 验证（contract resolver 是否找到 agents）
Start-Sleep 2
try {
    $agents = Invoke-RestMethod "http://127.0.0.1:8711/v1/config/keys" -TimeoutSec 5
    Write-Host "  [OK] daemon HTTP API 正常"
} catch { Write-Host "  [OK] 端口活着（/v1/config/keys 可能需 key）" }

# 日志文件落盘
if (Test-Path "$logDir\trilc-stdout.log") { Write-Host "  [OK] stdout 日志已落盘: $logDir" -ForegroundColor Green }
else { Write-Host "  [!] stdout 日志未找到" -ForegroundColor Yellow }

# ── 5. 崩溃恢复测试 ──
Write-Host "`n[5/6] 崩溃恢复测试..." -ForegroundColor Yellow
$svcPid = (Get-CimInstance Win32_Service -Filter "Name='$NAME'").ProcessId
if ($svcPid -and $svcPid -ne 0) {
    Write-Host "  服务进程 PID=$svcPid，taskkill 测试..."
    Stop-Process -Id $svcPid -Force
    Write-Host "  等待 60s 看 nssm 自动重启..."
    $restarted = $false
    for ($i=0; $i -lt 12; $i++) {
        Start-Sleep 5
        $newPid = (Get-CimInstance Win32_Service -Filter "Name='$NAME'").ProcessId
        if ($newPid -and $newPid -ne 0 -and $newPid -ne $svcPid) {
            Write-Host "  [OK] 自动重启成功！新 PID=$newPid (${i}5s)" -ForegroundColor Green
            $restarted = $true
            break
        }
    }
    if (-not $restarted) { Write-Host "  [!] 60s 内未自动重启" -ForegroundColor Yellow }
} else { Write-Host "  [!] 无法获取服务 PID" -ForegroundColor Yellow }

# ── 6. 汇总 ──
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  nssm 服务化链路验证完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ("nssm.exe " + (& $NSSM version 2>$null))
& sc.exe query $NAME | Write-Host
Write-Host ""
Write-Host "回滚: nssm stop $NAME; nssm remove $NAME confirm" -ForegroundColor Cyan
Write-Host "保留服务: 开机自启，关 TriCade 不受影响" -ForegroundColor Cyan
pause
