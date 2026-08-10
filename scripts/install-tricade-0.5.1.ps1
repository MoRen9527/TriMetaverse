# install-tricade-0.5.1.ps1
#  TriCade Bundle 0.5.1 — P0+P1 CC移植 + 7项CEO实测修复
#  Fixes: contract-resolver路径 | RegRun后台启动 | 退格删除兼容 | /命令精准匹配 | 优雅退出 | 守护进程启动恢复
# Right-click -> Run as administrator PowerShell
$ErrorActionPreference = "Stop"

$MSI   = "D:\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.5.1.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

# 0. Admin check
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] Admin privileges required. Right-click -> Run as administrator PowerShell" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI not found: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== TriCade Bundle 0.5.1 — P0+P1 CC + 7 CEO fixes ===" -ForegroundColor Cyan

# 1. Stop existing processes
Write-Host "`n[1/5] Stopping TriCade / node processes..." -ForegroundColor Yellow
Get-Process tricade -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2
Write-Host "  Processes stopped."

# 2. Install MSI
Write-Host "[2/5] Installing TriCade Bundle 0.5.1..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.5.1-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec exit=$($p.ExitCode). Log: $log" -ForegroundColor Red; pause; exit $p.ExitCode
}

# 3. Verify
Write-Host "[3/5] Verifying installation..." -ForegroundColor Yellow
Write-Host ("  dist/cli.js:              " + $(if(Test-Path "$TRILC\dist\cli.js"){"[OK]"}else{"[!]"}))
Write-Host ("  dist/server/app.js:       " + $(if(Test-Path "$TRILC\dist\server\app.js"){"[OK]"}else{"[!]"}))

# Verify contract-resolver fix: should use __dirname, not process.cwd()
$gEnv = Select-String -Path "$TRILC\dist\config\env.js" -Pattern "msiContracts|scriptDir.*dirname" -Quiet
Write-Host ("  contract-resolver path fix: " + $(if($gEnv){"[OK]"}else{"[!]"}))

# Verify RegRun fix: should use "start" not "run"
$gRegrun = Select-String -Path "$TRILC\dist\cli.js" -Pattern "start.*\/f" -Quiet
Write-Host ("  RegRun background start:    " + $(if($gRegrun){"[OK]"}else{"[!]"}))

# Verify backspace fallback
$gBackspace = Select-String -Path "$TRILC\dist\tui\hooks\useCursorInput.js" -Pattern "\\\\x08.*\\\\x7f|\\\\x7f.*\\\\x08" -Quiet
Write-Host ("  Backspace raw-char fallback: " + $(if($gBackspace){"[OK]"}else{"[!]"}))

# Verify graceful exit
$gExit = Select-String -Path "$TRILC\dist\tui\app.js" -Pattern "setImmediate.*process.exit" -Quiet
Write-Host ("  Graceful exit (setImmediate): " + $(if($gExit){"[OK]"}else{"[!]"}))

# Verify command hint prefix matching
$gCmdHint = Select-String -Path "$TRILC\dist\tui\components\InputBox.js" -Pattern "prefixMatch|startsWith.*query" -Quiet
Write-Host ("  Command prefix matching:      " + $(if($gCmdHint){"[OK]"}else{"[!]"}))

# Core files
Write-Host ("  CC tools (5/5):            " + $(if(
  (Test-Path "$TRILC\dist\tools\file-read.js") -and
  (Test-Path "$TRILC\dist\tools\file-write.js") -and
  (Test-Path "$TRILC\dist\tools\file-edit.js") -and
  (Test-Path "$TRILC\dist\tools\file-glob.js") -and
  (Test-Path "$TRILC\dist\tools\file-grep.js")
){"[OK]"}else{"[!]"}))

Write-Host ("  Agent contracts:           " + $(if((Test-Path "$TRILC\contracts") -and (Get-ChildItem "$TRILC\contracts" -Directory).Count -eq 12){"[OK] 12/12"}else{"[!]"}))

# 4. RegRun auto-start
Write-Host "`n[4/5] Enabling RegRun auto-start..." -ForegroundColor Yellow
$trilcCmd = "$TRILC\trilc.cmd"
if (Test-Path $trilcCmd) {
  & "$trilcCmd" install-regrun 2>&1 | Write-Host
} else {
  Write-Host "  [!] trilc.cmd not found" -ForegroundColor Yellow
}

# 5. Done
Write-Host "`n[5/5] TriCade Bundle 0.5.1 deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "  Fixes in 0.5.1:" -ForegroundColor Cyan
Write-Host "    1. contract-resolver: use script dir instead of process.cwd()"
Write-Host "    2. RegRun: daemon starts in background (start, not run)"
Write-Host "    3. Backspace/Delete: raw-char fallback for Windows terminals"
Write-Host "    4. / command: prefix-priority matching + tighter threshold"
Write-Host "    5. Exit: setImmediate graceful shutdown"
Write-Host "    6. Chat startup: auto-kill stale daemon before restart"
Write-Host ""
Write-Host "  MSI: TriCade-Bundle-x64-0.5.1.msi (6.4 MB)" -ForegroundColor Cyan
Write-Host "  ProductCode: C9C4FB2B-2137-4BB1-AA45-2A118442F26A" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Test checklist:" -ForegroundColor Magenta
Write-Host "    1. trilc chat (should start without 'failed to start within 30s')"
Write-Host "    2. Backspace/Delete keys"
Write-Host "    3. /stat -> should show /status as top match"
Write-Host "    4. Ctrl+C twice -> clean exit without error"
Write-Host "    5. Read a local file -> should respond (not hang)"
Write-Host "    6. Daemon runs in background (no foreground PowerShell window)"
Write-Host "    7. [contract-resolver] log shows correct path (not C:\\Windows\\TriCompany)"
pause
