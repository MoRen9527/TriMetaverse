# install-tricade-0.5.2.ps1
#  TriCade Bundle 0.5.2 — P0+P1 CC移植 + Backspace根因修复 + 7项CEO实测修复
#  Root cause: Ink parseKeypress maps \x7f (Windows Backspace key) to key.delete,
#              so del() ran (no-op at line end) instead of backspace().
#  Fix: treat key.backspace OR key.delete as backspace (delete char before cursor).
# Right-click -> Run as administrator PowerShell
$ErrorActionPreference = "Stop"

$MSI   = "D:\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.5.2.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

# 0. Admin check
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] Admin privileges required. Right-click -> Run as administrator PowerShell" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI not found: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== TriCade Bundle 0.5.2 — Backspace root-cause fix ===" -ForegroundColor Cyan

# 1. Stop existing processes
Write-Host "`n[1/4] Stopping TriCade / node processes..." -ForegroundColor Yellow
Get-Process tricade -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2
Write-Host "  Processes stopped."

# 2. Install MSI
Write-Host "[2/4] Installing TriCade Bundle 0.5.2..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.5.2-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec exit=$($p.ExitCode). Log: $log" -ForegroundColor Red; pause; exit $p.ExitCode
}

# 3. Verify — KEY: backspace fix
Write-Host "[3/4] Verifying backspace fix..." -ForegroundColor Yellow
$gBackspace = Select-String -Path "$TRILC\dist\tui\hooks\useCursorInput.js" -Pattern "key\.backspace \|\| key\.delete" -Quiet
Write-Host ("  Backspace fix (key.backspace || key.delete): " + $(if($gBackspace){"[OK]"}else{"[!] NOT APPLIED"}))

# Other fixes from 0.5.1
$gEnv = Select-String -Path "$TRILC\dist\config\env.js" -Pattern "msiContracts|scriptDir.*dirname" -Quiet
Write-Host ("  contract-resolver path fix: " + $(if($gEnv){"[OK]"}else{"[!]"}))
$gRegrun = Select-String -Path "$TRILC\dist\cli.js" -Pattern "start.*\/f" -Quiet
Write-Host ("  RegRun background start:    " + $(if($gRegrun){"[OK]"}else{"[!]"}))
$gExit = Select-String -Path "$TRILC\dist\tui\app.js" -Pattern "setImmediate.*process.exit" -Quiet
Write-Host ("  Graceful exit:              " + $(if($gExit){"[OK]"}else{"[!]"}))

# 4. Done
Write-Host "`n[4/4] TriCade Bundle 0.5.2 deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "  MSI: TriCade-Bundle-x64-0.5.2.msi (6.4 MB)" -ForegroundColor Cyan
Write-Host "  SHA-256: 63c2d84624b082d0b656a8763af0414c33b3fcdd8287f0da459fdbeb9b09cea5" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Root cause of backspace failure:" -ForegroundColor Yellow
Write-Host "    Windows Terminal Backspace key sends \x7f"
Write-Host "    Ink parses \x7f as key.name='delete' (not 'backspace')"
Write-Host "    -> del() deleted char AFTER cursor (no-op at line end)"
Write-Host "    Fix: key.backspace || key.delete both -> backspace()" -ForegroundColor Green
Write-Host ""
Write-Host "  Test now:" -ForegroundColor Magenta
Write-Host "    1. trilc chat"
Write-Host "    2. Type some text, press Backspace -> should delete last char"
Write-Host "    3. Move cursor to middle, press Backspace -> should delete char before cursor"
pause
