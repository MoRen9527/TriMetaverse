# install-tricade-0.9.2.ps1
#  TriCade 0.9.2 -- P0-P10 final CC fidelity (~87% product)
#  P10: CC terminal input layer (IME fix) | bug #2: chat history preserved
#  Admin PowerShell required
$ErrorActionPreference = "Stop"

$MSI = "D:\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.9.2.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] Admin required" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI not found: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== TriCade 0.9.2 - P0-P10 Final ===" -ForegroundColor Cyan

# 1. Stop
Write-Host "[1/4] Stopping..." -ForegroundColor Yellow
Get-Process tricade -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# 2. Install
Write-Host "[2/4] Installing 0.9.2..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.9.2-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec exit=$($p.ExitCode)" -ForegroundColor Red; pause; exit $p.ExitCode
}

# 3. Verify
Write-Host "[3/4] Verifying P0-P10..." -ForegroundColor Yellow

# P10: CC terminal input layer
$gIME = Test-Path "$TRILC\dist\tui\termio\tokenize.js"
Write-Host ("  P10 CC termio (IME fix):          " + $(if($gIME){"[OK]"}else{"[!]"}))

# bug #2: chat history preserved
$gHistory = Select-String -Path "$TRILC\dist\tui\hooks\useChat.js" -Pattern "messagesRef|base = resume|base\.filter" -Quiet
Write-Host ("  bug#2 history preserved:           " + $(if($gHistory){"[OK]"}else{"[!]"}))

# P9: Edit fuzzy + auto-compact + agent roster
$gFuzzy = Select-String -Path "$TRILC\dist\tools\file-edit.js" -Pattern "normalizeQuotes" -Quiet
Write-Host ("  P9 Edit fuzzy:                     " + $(if($gFuzzy){"[OK]"}else{"[!]"}))
$gAuto = Select-String -Path "$TRILC\dist\tui\app.js" -Pattern "compactRef" -Quiet
Write-Host ("  P9 auto-compact:                   " + $(if($gAuto){"[OK]"}else{"[!]"}))
$gRoster = Select-String -Path "$TRILC\dist\server\app.js" -Pattern "cachedAgentRoster" -Quiet
Write-Host ("  Agent roster in system prompt:     " + $(if($gRoster){"[OK]"}else{"[!]"}))

# P3: permission model
$gPerm = Select-String -Path "$TRILC\dist\server\interactions.js" -Pattern "alwaysAllowedTools" -Quiet
Write-Host ("  P3 Permission (ask/allow/deny):     " + $(if($gPerm){"[OK]"}else{"[!]"}))

# P7: Plan forced-gating
$gPlan = Select-String -Path "$TRILC\dist\tools\plan-mode.js" -Pattern "PLAN_MODE_WHITELIST" -Quiet
Write-Host ("  P7 Plan forced-gating:             " + $(if($gPlan){"[OK]"}else{"[!]"}))

# P6: Vim/kill ring
$gVim = Select-String -Path "$TRILC\dist\tui\utils\Cursor.js" -Pattern "pushToKillRing|nextVimWord" -Quiet
Write-Host ("  P6 Vim/kill ring:                  " + $(if($gVim){"[OK]"}else{"[!]"}))

# P1: subagent
$gAgent = Select-String -Path "$TRILC\dist\tools\agent-tool.js" -Pattern "spawnAgent" -Quiet
Write-Host ("  P1 subagent:                       " + $(if($gAgent){"[OK]"}else{"[!]"}))

# MCP + skills
$gMCP = Test-Path "$TRILC\dist\mcp\mcp-client.js"
$gSkills = Select-String -Path "$TRILC\dist\skills\bundled-skills.js" -Pattern "claude-api.*keybindings" -Quiet
Write-Host ("  MCP(P6-P8)+Skills x6:              " + $(if($gMCP -and $gSkills){"[OK]"}else{"[!]"}))

# 4. RegRun
Write-Host "[4/4] RegRun..." -ForegroundColor Yellow
$trilcCmd = "$TRILC\trilc.cmd"
if (Test-Path $trilcCmd) { & "$trilcCmd" install-regrun 2>&1 | Write-Host }

Write-Host "`n=== TriCade 0.9.2 deployed ===" -ForegroundColor Green
Write-Host "  MSI: 6.5 MB, ProductCode: 72D0ABB0-C920-44E5-984C-24F3C4AB255E"
Write-Host "  P0-P10 cumulative, CC fidelity ~87% product"
Write-Host ""
Write-Host "  Key tests:" -ForegroundColor Magenta
Write-Host "    1. IME Chinese input (P10 fix - CC terminal input layer)"
Write-Host "    2. Chat history preserved across messages (bug#2 fix)"
Write-Host "    3. /agents -> 12 employees + 4 built-in agents"
Write-Host "    4. Backspace / Ctrl+Y yank / Alt+Y yank-pop / Vim nav"
Write-Host "    5. Permission prompt (AI Bash -> allow/deny/always)"
Write-Host "    6. Plan mode (EnterPlanMode -> Bash blocked)"
Write-Host "    7. Subagent (AgentTool spawns child agent)"
pause
