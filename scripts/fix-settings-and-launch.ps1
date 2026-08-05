# fix-settings-and-launch.ps1 — P0-3/4: 同步 settings + 启动 TriCade（--extensions-dir）
# 用法（管理员 PowerShell）: & .\fix-settings-and-launch.ps1

$ErrorActionPreference = "Stop"
$TriCadeDir = "C:\Program Files\TriCade"

# 1. 同步 settings.json（trilc-direct schema）到用户数据目录
# 品牌化前 win32DirName 是 VSCodium，用户数据在 %APPDATA%\VSCodium
$userDir = Join-Path $env:APPDATA "VSCodium"
$userSettingsDir = Join-Path $userDir "User"
New-Item -ItemType Directory -Force -Path $userSettingsDir | Out-Null
Copy-Item -Force "D:\OneDrive\Code\ai\TriMetaverse\config\settings.json" (Join-Path $userSettingsDir "settings.json")
Write-Host "[OK] settings.json -> $userSettingsDir"

# 2. 确认 daemon 在跑
$health = curl.exe -s http://127.0.0.1:8711/healthz 2>$null
if ($health) {
    Write-Host "[OK] TriLC daemon healthy"
} else {
    Write-Host "[!] daemon not responding — trilc start 先启动"
}

# 3. 启动 TriCade（--extensions-dir 指向程序目录扩展）
Write-Host "`n=== Launching TriCade ==="
Start-Process "$TriCadeDir\tricade.exe" -ArgumentList "--extensions-dir `"$TriCadeDir\extensions`""
Write-Host "[OK] launched: tricade.exe --extensions-dir $TriCadeDir\extensions"
