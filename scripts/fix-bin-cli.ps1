# fix-bin-cli.ps1 — P0-1: 修复 TriCade bin CLI 引用（VSCodium.exe → tricade.exe）
# 用法（管理员 PowerShell）: & .\fix-bin-cli.ps1

$ErrorActionPreference = "Stop"
$BinDir = "C:\Program Files\TriCade\bin"

# 1. 清理刚才误创建的 Cricade.cmd（如果存在）
$errFile = Join-Path (Get-Location) "Cricade.cmd"
if (Test-Path $errFile) { Remove-Item $errFile -Force; Write-Host "cleaned: $errFile" }
$errFile2 = "C:\Windows\System32\Cricade.cmd"
if (Test-Path $errFile2) { Remove-Item $errFile2 -Force; Write-Host "cleaned: $errFile2" }

# 2. 重写 codium.cmd（引用 tricade.exe）
$content = @"
@echo off
setlocal
set VSCODE_DEV=
set ELECTRON_RUN_AS_NODE=1
"%~dp0..\tricade.exe" "%~dp0..\resources\app\out\cli.js" %*
IF %ERRORLEVEL% NEQ 0 EXIT /b %ERRORLEVEL%
endlocal
"@
Set-Content -Path "$BinDir\codium.cmd" -Value $content -Encoding ASCII
Write-Host "[OK] codium.cmd rewritten"

# 3. 创建 tricade.cmd（品牌 CLI）
Copy-Item "$BinDir\codium.cmd" "$BinDir\tricade.cmd" -Force
Write-Host "[OK] tricade.cmd created"

# 4. 验证 CLI
Write-Host "`n=== Verify ==="
& "$BinDir\tricade.cmd" --version
Write-Host "=== Done ==="
