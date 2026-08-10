# install-tricade-0.7.1.ps1
#  TriCade 0.7.1 -- P0-P5 CC fidelity cumulative (product fidelity ~85%)
#  Requires admin PowerShell
$ErrorActionPreference = "Stop"

$MSI   = "D:\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.7.1.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] Admin required. Right-click -> Run as administrator" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI not found: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== TriCade 0.7.1 - P0-P5 CC fidelity (~85% product) ===" -ForegroundColor Cyan

# 1. Stop processes
Write-Host "`n[1/4] Stopping processes..." -ForegroundColor Yellow
Get-Process tricade -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# 2. Install MSI
Write-Host "[2/4] Installing TriCade 0.7.1..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.7.1-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec exit=$($p.ExitCode). Log: $log" -ForegroundColor Red; pause; exit $p.ExitCode
}

# 3. Verify P0-P5 features
Write-Host "[3/4] Verifying..." -ForegroundColor Yellow
Write-Host ("  dist/cli.js:                   " + $(if(Test-Path "$TRILC\dist\cli.js"){"[OK]"}else{"[!]"}))

# P5: AgentPanel UI
$gAgentPanel = Select-String -Path "$TRILC\dist\tui\app.js" -Pattern "AgentPanel|agentStates" -Quiet
Write-Host ("  P5 AgentPanel UI:              " + $(if($gAgentPanel){"[OK]"}else{"[!]"}))

# P5: /init Phase 1-4
$gInitPhase = Select-String -Path "$TRILC\dist\tui\app.js" -Pattern "Phase 1.*Explore" -Quiet
Write-Host ("  P5 /init Phase 1-4:            " + $(if($gInitPhase){"[OK]"}else{"[!]"}))

# P3: permission model
$gPerm = Select-String -Path "$TRILC\dist\server\interactions.js" -Pattern "alwaysAllowedTools|kind.*permission" -Quiet
Write-Host ("  P3 permission (ask/allow/deny): " + $(if($gPerm){"[OK]"}else{"[!]"}))

# P1: subagent
$gAgent = Select-String -Path "$TRILC\dist\tools\agent-tool.js" -Pattern "spawnAgent" -Quiet
Write-Host ("  P1 subagent (AgentTool):       " + $(if($gAgent){"[OK]"}else{"[!]"}))

# P2: skills + compact
$gSkills = Test-Path "$TRILC\dist\skills\bundled-skills.js"
$gCompact = Test-Path "$TRILC\dist\services\compact\compact.js"
Write-Host ("  P2 skills + compact:           " + $(if($gSkills -and $gCompact){"[OK]"}else{"[!]"}))

# P0: backspace + contract-resolver
$gBackspace = Select-String -Path "$TRILC\dist\tui\hooks\useCursorInput.js" -Pattern "key\.backspace \|\| key\.delete" -Quiet
Write-Host ("  P0 backspace fix:              " + $(if($gBackspace){"[OK]"}else{"[!]"}))
$gEnv = Select-String -Path "$TRILC\dist\config\env.js" -Pattern "msiContracts|scriptDir.*dirname" -Quiet
Write-Host ("  P0 contract-resolver path fix:  " + $(if($gEnv){"[OK]"}else{"[!]"}))

# CC tools count
$toolsDir = "$TRILC\dist\tools"
$toolFiles = @("file-read","file-write","file-edit","file-glob","file-grep","file-ls","todo-write","send-message","agent-tool","skill-tool","ask-user-question-tool","shell-exec")
$toolOk = 0; foreach ($t in $toolFiles) { if (Test-Path "$toolsDir\$t.js") { $toolOk++ } }
Write-Host ("  CC tools ($toolOk/$($toolFiles.Count)):           " + $(if($toolOk -ge $toolFiles.Count){"[OK]"}else{"[!]"}))

# Agent contracts + session
$contractCount = if (Test-Path "$TRILC\contracts") { (Get-ChildItem "$TRILC\contracts" -Directory).Count } else { 0 }
Write-Host ("  Agent contracts:               " + $(if($contractCount -eq 12){"[OK] 12/12"}else{"[!]"}))
Write-Host ("  Session persistence:           " + $(if(Select-String -Path "$TRILC\dist\server\app.js" -Pattern "/internal/v1/sessions" -Quiet){"[OK]"}else{"[!]"}))

# 4. RegRun + Done
Write-Host "`n[4/4] RegRun auto-start..." -ForegroundColor Yellow
$trilcCmd = "$TRILC\trilc.cmd"
if (Test-Path $trilcCmd) { & "$trilcCmd" install-regrun 2>&1 | Write-Host }

Write-Host "`n=== TriCade 0.7.1 deployed ===" -ForegroundColor Green
Write-Host "  MSI: TriCade-Bundle-x64-0.7.1.msi (6.4 MB)"
Write-Host "  ProductCode: D0E8DC9D-9A52-4F10-AF34-AB36C9913B00"
Write-Host "  CC fidelity: ~85% product / ~93% technical"
Write-Host "  P5 new: AgentPanel UI + /init Phase 1-4 structured"
Write-Host ""
Write-Host "  Test checklist (12 items):" -ForegroundColor Magenta
Write-Host "    1. trilc chat (start daemon)"
Write-Host "    2. Backspace delete key"
Write-Host "    3. /model deepseek-v4-pro (real switch)"
Write-Host "    4. /context + /cost (token/cost visible)"
Write-Host "    5. /agents (list built-in agents)"
Write-Host "    6. /init (AI Phase 1-4 project analysis -> CLAUDE.md)"
Write-Host "    7. AI runs Bash -> permission prompt (allow/deny/always)"
Write-Host "    8. AI spawns subagent -> AgentPanel shows agent status"
Write-Host "    9. AI uses TodoWrite -> task list + verification nudge"
Write-Host "   10. /compact (long session real compression)"
Write-Host "   11. AskUserQuestion (AI asks multi-choice, press number to select)"
Write-Host "   12. Skill tools (simplify/debug/remember)"
pause
