# install-tricade-0.5.3.ps1
#  TriCade Bundle 0.5.3 — Shell hang root-cause fix + platform-aware prompt + backspace fix
#  Fixes:
#    1. Shell hang: process-supervisor now closes stdin for one-shot commands
#       (Windows find.exe/grep without args used to block on stdin -> 30s hang)
#    2. Platform-aware system prompt: model now knows it runs on Windows,
#       generates dir/where/findstr instead of ls/find/pwd
#    3. Backspace: key.delete (Windows \x7f Backspace) now deletes char before cursor
# Right-click -> Run as administrator PowerShell
$ErrorActionPreference = "Stop"

$MSI   = "D:\OneDrive\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.5.3.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] Admin required. Right-click -> Run as administrator" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI not found: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== TriCade Bundle 0.5.3 — Shell hang + platform prompt + backspace ===" -ForegroundColor Cyan

# 1. Stop processes
Write-Host "`n[1/4] Stopping processes..." -ForegroundColor Yellow
Get-Process tricade -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# 2. Install MSI
Write-Host "[2/4] Installing TriCade Bundle 0.5.3..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.5.3-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec exit=$($p.ExitCode). Log: $log" -ForegroundColor Red; pause; exit $p.ExitCode
}

# 3. Verify all 3 fixes
Write-Host "[3/4] Verifying fixes..." -ForegroundColor Yellow
$gStdin = Select-String -Path "$TRILC\node_modules\@trimetaverse\agent-core\dist\process-supervisor\supervisor.js" -Pattern "child.stdin.end\(\)" -Quiet
Write-Host ("  Shell stdin-close fix:        " + $(if($gStdin){"[OK]"}else{"[!]"}))

$gPrompt = Select-String -Path "$TRILC\dist\server\app.js" -Pattern "defaultSystemPrompt|Windows-compatible|findstr" -Quiet
Write-Host ("  Platform-aware prompt:        " + $(if($gPrompt){"[OK]"}else{"[!]"}))

$gBackspace = Select-String -Path "$TRILC\dist\tui\hooks\useCursorInput.js" -Pattern "key.backspace \|\| key.delete" -Quiet
Write-Host ("  Backspace fix:                " + $(if($gBackspace){"[OK]"}else{"[!]"}))

# 4. Done
Write-Host "`n[4/4] TriCade Bundle 0.5.3 deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "  MSI: TriCade-Bundle-x64-0.5.3.msi (6.4 MB)" -ForegroundColor Cyan
Write-Host "  ProductCode: 11EFD975-67D6-4AD0-8A89-E8618C1BDBEB" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Root causes fixed:" -ForegroundColor Yellow
Write-Host "    1. Shell hang: supervisor kept stdin open -> find.exe blocked on it"
Write-Host "       Now closes stdin for one-shot commands (no more 30s freeze)"
Write-Host "    2. Model generated Unix commands (ls/find/pwd) on Windows"
Write-Host "       Now injects Windows-aware system prompt (dir/where/findstr)"
Write-Host "    3. Backspace: \x7f parsed as delete -> del() no-op at line end"
Write-Host "       Now key.delete also backspaces (deletes char before cursor)"
Write-Host ""
Write-Host "  Test:" -ForegroundColor Magenta
Write-Host "    1. trilc chat"
Write-Host "    2. Backspace deletes last char"
Write-Host "    3. Ask it to find a file -> should use Glob/Grep tool or Windows cmds"
Write-Host "       (no more hang on find -name)"
pause
