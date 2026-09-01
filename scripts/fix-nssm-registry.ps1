# fix-nssm-registry.ps1
# 直接写注册表修复 nssm AppParameters（绕过所有命令行引号坑）
# 8.3 路径无空格 = 不需要引号
$ErrorActionPreference = "Stop"
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] 需要管理员" -ForegroundColor Red; pause; exit 1 }

$regPath = "HKLM:\SYSTEM\CurrentControlSet\Services\TriRLC\Parameters"
$NSSM = "D:\Code\ai\TriMetaverse\tools\nssm\nssm.exe"

Write-Host "=== 直接写注册表修复 nssm 参数 ===" -ForegroundColor Cyan

# 停服务
Write-Host "[1/3] 停服务..." -ForegroundColor Yellow
& $NSSM stop TriRLC 2>$null | Out-Null
Start-Sleep 3

# 直接写注册表（无引号 = 无截断）
Write-Host "[2/3] 写注册表（8.3 路径，无引号）..." -ForegroundColor Yellow
Set-ItemProperty -Path $regPath -Name Application -Value "C:\PROGRA~1\nodejs\node.exe"
Set-ItemProperty -Path $regPath -Name AppParameters -Value "C:\PROGRA~1\TriCade\RESOUR~1\app\tools\trirlc\dist\cli.js run"

# 验证写入
$app = (Get-ItemProperty -Path $regPath -Name Application).Application
$params = (Get-ItemProperty -Path $regPath -Name AppParameters).AppParameters
Write-Host "  Application:  $app"
Write-Host "  AppParameters: $params"

# 清旧日志 + 启动
Write-Host "[3/3] 清日志 + 启动..." -ForegroundColor Yellow
Remove-Item "C:\ProgramData\TriCade\logs\trilc-*.log" -ErrorAction SilentlyContinue
& $NSSM start TriRLC

# 等 8 秒
Write-Host "  等待 8s..." -ForegroundColor Cyan
Start-Sleep 8

# 验证
$status = & $NSSM status TriRLC
Write-Host "  status: $status" -ForegroundColor $(if($status -match "RUNNING"){"Green"}else{"Yellow"})
& sc.exe query TriRLC | Write-Host

$listen = netstat -ano | Select-String ":8711.*LISTENING"
if ($listen) {
    Write-Host "  [OK] 8711 LISTENING" -ForegroundColor Green
    try {
        $h = Invoke-RestMethod "http://127.0.0.1:8711/healthz" -TimeoutSec 5
        Write-Host "  [OK] /healthz: ok=$($h.ok)" -ForegroundColor Green
    } catch { Write-Host "  [!] /healthz: $_" -ForegroundColor Yellow }
} else {
    Write-Host "  [!] 8711 未监听 — 日志:" -ForegroundColor Red
    Get-Content "C:\ProgramData\TriCade\logs\trilc-stdout.log" -Tail 5 -ErrorAction SilentlyContinue | Write-Host
    Get-Content "C:\ProgramData\TriCade\logs\trilc-stderr.log" -Tail 5 -ErrorAction SilentlyContinue | Write-Host
}
pause
