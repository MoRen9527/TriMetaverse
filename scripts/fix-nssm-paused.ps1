# fix-nssm-paused.ps1
# 修复 nssm PAUSED 状态：trilc daemon 初始化需 ~3s，nssm 默认 AppThrottle 1.5s 太短
# 用法：管理员 PowerShell 运行
$NSSM = "D:\Code\ai\TriMetaverse\tools\nssm\nssm.exe"
$NAME = "TriLC"

Write-Host "=== 修复 nssm PAUSED（trilc daemon 初始化慢）===" -ForegroundColor Cyan

# 1. 停服务（如果在跑）
Write-Host "[1/4] 停服务..." -ForegroundColor Yellow
& $NSSM stop $NAME 2>$null | Out-Null
Start-Sleep 3

# 2. 调整 nssm 参数
Write-Host "[2/4] 调整 nssm 参数..." -ForegroundColor Yellow
# AppThrottle 5000: 给 daemon 5 秒初始化（默认 1.5s 太短 → PAUSED）
& $NSSM set $NAME AppThrottle 5000
Write-Host "  AppThrottle: 5000ms（原 1500ms）"

# AppStopMethodSkip 6: 跳过所有优雅停止方式，直接 kill（非服务程序不需要）
& $NSSM set $NAME AppStopMethodSkip 6
Write-Host "  AppStopMethodSkip: 6（直接 kill）"

# AppExit Default Restart: 进程退出时自动重启
& $NSSM set $NAME AppExit Default Restart
Write-Host "  AppExit: Restart"

# 确认 8.3 路径（之前手动设过，这里 double-check）
& $NSSM set $NAME Application "C:\PROGRA~1\nodejs\node.exe"
& $NSSM set $NAME AppParameters "\"C:\PROGRA~1\TriCade\RESOUR~1\app\tools\trilc\dist\cli.js\" run"
Write-Host "  Application + AppParameters: 8.3 路径确认"

# 3. 清旧日志 + 启动
Write-Host "[3/4] 清旧日志 + 启动..." -ForegroundColor Yellow
Remove-Item "C:\ProgramData\TriCade\logs\trilc-*.log" -ErrorAction SilentlyContinue
& $NSSM start $NAME

# 4. 等 8 秒看状态
Write-Host "[4/4] 等待 8s（daemon 初始化）..." -ForegroundColor Yellow
Start-Sleep 8

$status = & $NSSM status $NAME
Write-Host "  nssm status: $status" -ForegroundColor $(if($status -match "RUNNING"){"Green"}else{"Yellow"})

# sc query 看详细
& sc.exe query $NAME | Write-Host

# 端口 + healthz
$listen = netstat -ano | Select-String ":8711.*LISTENING"
if ($listen) {
    Write-Host "  [OK] 8711 监听: $($listen.Line.Trim())" -ForegroundColor Green
    try {
        $h = Invoke-RestMethod "http://127.0.0.1:8711/healthz" -TimeoutSec 5
        Write-Host "  [OK] /healthz: ok=$($h.ok)" -ForegroundColor Green
    } catch {
        Write-Host "  [!] /healthz: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [!] 8711 未监听" -ForegroundColor Red
    Write-Host "  日志尾部:" -ForegroundColor Yellow
    Get-Content "C:\ProgramData\TriCade\logs\trilc-stdout.log" -Tail 5 -ErrorAction SilentlyContinue | Write-Host
    Get-Content "C:\ProgramData\TriCade\logs\trilc-stderr.log" -Tail 5 -ErrorAction SilentlyContinue | Write-Host
}

Write-Host "`n=== 完成 ===" -ForegroundColor Cyan
pause
