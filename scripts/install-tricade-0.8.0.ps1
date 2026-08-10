# install-tricade-0.8.0.ps1
#  TriCade 0.8.0 -- P0-P8 full CC fidelity (~87% product / ~93% technical)
#  15+ tools | permission model | subagent | Plan forced-gating | MCP (tools+resources+prompts)
#  Vim/kill ring | skills x6 | /model /context /cost /agents /review /branch /init phase
#  Admin PowerShell required
$ErrorActionPreference = "Stop"

$MSI   = "D:\OneDrive\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.8.0.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] Admin required. Right-click -> Run as administrator" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI not found: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== TriCade 0.8.0 - P0-P8 CC fidelity (~87% product) ===" -ForegroundColor Cyan

# 1. Stop
Write-Host "`n[1/4] Stopping processes..." -ForegroundColor Yellow
Get-Process tricade -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# 2. Install
Write-Host "[2/4] Installing TriCade 0.8.0..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.8.0-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec exit=$($p.ExitCode)" -ForegroundColor Red; pause; exit $p.ExitCode
}

# 3. Quick verify
Write-Host "[3/4] Verifying..." -ForegroundColor Yellow
Write-Host ("  dist/cli.js:                       " + $(if(Test-Path "$TRILC\dist\cli.js"){"[OK]"}else{"[!]"}))
Write-Host ("  Permission model (P3):             " + $(if(Select-String -Path "$TRILC\dist\server\interactions.js" -Pattern "alwaysAllowedTools" -Quiet){"[OK]"}else{"[!]"}))
Write-Host ("  Subagent AgentTool (P1):           " + $(if(Select-String -Path "$TRILC\dist\tools\agent-tool.js" -Pattern "spawnAgent" -Quiet){"[OK]"}else{"[!]"}))
Write-Host ("  Plan forced-gating (P7):           " + $(if(Select-String -Path "$TRILC\dist\tools\plan-mode.js" -Pattern "PLAN_MODE_WHITELIST|planModeTimer" -Quiet){"[OK]"}else{"[!]"}))
Write-Host ("  MCP client (P6/P7/P8):             " + $(if(Test-Path "$TRILC\dist\mcp\mcp-client.js"){"[OK]"}else{"[!]"}))
Write-Host ("  Vim/kill ring (P6):                " + $(if(Select-String -Path "$TRILC\dist\tui\utils\Cursor.js" -Pattern "pushToKillRing|nextVimWord" -Quiet){"[OK]"}else{"[!]"}))
Write-Host ("  Skills x6 (P6):                     " + $(if(Select-String -Path "$TRILC\dist\skills\bundled-skills.js" -Pattern "claude-api.*keybindings.*lorem" -Quiet){"[OK]"}else{"[!]"}))

# 4. RegRun
Write-Host "`n[4/4] RegRun..." -ForegroundColor Yellow
$trilcCmd = "$TRILC\trilc.cmd"
if (Test-Path $trilcCmd) { & "$trilcCmd" install-regrun 2>&1 | Write-Host }

Write-Host "`n=== TriCade 0.8.0 deployed ===" -ForegroundColor Green
Write-Host "  MSI: TriCade-Bundle-x64-0.8.0.msi (6.5 MB)"
Write-Host "  ProductCode: 46F36720-1780-456A-A216-3AD4D9A3C360"
Write-Host "  P0-P8 cumulative, ~15 tools, CC fidelity ~87% product"
Write-Host ""
Write-Host "  Key tests:" -ForegroundColor Magenta
Write-Host "    1. trilc chat (daemon backend)"
Write-Host "    2. Backspace (P0 fix)"
Write-Host "    3. /model switch + /context + /cost + /agents"
Write-Host "    4. /init (AI Phase 1-4 project analysis)"
Write-Host "    5. AI Bash -> permission prompt (allow/deny/always) [P3]"
Write-Host "    6. AI spawns subagent -> AgentPanel shows status [P1+P5]"
Write-Host "    7. /plan -> AI in plan mode -> Bash blocked [P7]"
Write-Host "    8. Ctrl+Y yank + Alt+Y yank-pop [P6]"
Write-Host "    9. Ctrl+Up/Down Vim line nav [P6]"
Write-Host "   10. /review [P6] + /branch [P6]"
Write-Host "   11. AskUserQuestion (AI multi-choice, number select) [P3]"
Write-Host "   12. Skill tools (simplify/debug/remember/claude-api/keybindings/loremIpsum) [P2+P6]"
Write-Host "   13. /compact (long session real compression) [v2]"
Write-Host "   14. MCP (tools+resources+prompts) [P6+P7+P8]"
pause
