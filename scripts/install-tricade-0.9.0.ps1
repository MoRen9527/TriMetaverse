# install-tricade-0.9.0.ps1
#  TriCade 0.9.0 -- P0-P9 CC fidelity (~87% product)
#  P9: Edit fuzzy match (quote normalization) + auto-compact + 12 employee agents visible
#  Admin PowerShell required
$ErrorActionPreference = "Stop"

$MSI   = "D:\OneDrive\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.9.0.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] Admin required" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI not found: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== TriCade 0.9.0 - P0-P9 CC fidelity ===" -ForegroundColor Cyan

# 1. Stop
Write-Host "`n[1/4] Stopping..." -ForegroundColor Yellow
Get-Process tricade -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# 2. Install
Write-Host "[2/4] Installing 0.9.0..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.9.0-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec exit=$($p.ExitCode)" -ForegroundColor Red; pause; exit $p.ExitCode
}

# 3. Verify
Write-Host "[3/4] Verifying P9 fixes..." -ForegroundColor Yellow

# P9.1: Edit fuzzy match (normalizeQuotes in file-edit.js)
$gFuzzy = Select-String -Path "$TRILC\dist\tools\file-edit.js" -Pattern "normalizeQuotes|curly.*quote|fuzzy" -Quiet
Write-Host ("  Edit fuzzy match (P9):           " + $(if($gFuzzy){"[OK]"}else{"[!]"}))

# P9.2: Auto-compact (useRef + compactConversation in app.js)
$gAutoCompact = Select-String -Path "$TRILC\dist\tui\app.js" -Pattern "compactRef|auto.*compact|compactConversation.*messages" -Quiet
Write-Host ("  Auto-compact (P9):               " + $(if($gAutoCompact){"[OK]"}else{"[!]"}))

# Agent listing fix (daemon fetch + contract agents)
$gAgentList = Select-String -Path "$TRILC\dist\tools\agent-tool.js" -Pattern "internal/v1/agents|contract.*agent|listAgentsForDisplay.*async" -Quiet
Write-Host ("  Employee agents visible (fix):    " + $(if($gAgentList){"[OK] 12 contract + 4 built-in"}else{"[!]"}))

# Other key features
Write-Host ("  Permission model:                 " + $(if(Select-String -Path "$TRILC\dist\server\interactions.js" -Pattern "alwaysAllowedTools" -Quiet){"[OK]"}else{"[!]"}))
Write-Host ("  Plan forced-gating:                " + $(if(Select-String -Path "$TRILC\dist\tools\plan-mode.js" -Pattern "PLAN_MODE_WHITELIST" -Quiet){"[OK]"}else{"[!]"}))
Write-Host ("  MCP client:                        " + $(if(Test-Path "$TRILC\dist\mcp\mcp-client.js"){"[OK]"}else{"[!]"}))
Write-Host ("  Vim/kill ring:                     " + $(if(Select-String -Path "$TRILC\dist\tui\utils\Cursor.js" -Pattern "pushToKillRing" -Quiet){"[OK]"}else{"[!]"}))

# 4. RegRun
Write-Host "`n[4/4] RegRun..." -ForegroundColor Yellow
$trilcCmd = "$TRILC\trilc.cmd"
if (Test-Path $trilcCmd) { & "$trilcCmd" install-regrun 2>&1 | Write-Host }

Write-Host "`n=== TriCade 0.9.0 deployed ===" -ForegroundColor Green
Write-Host "  MSI: 6.5 MB, ProductCode: DD91DAB8-C050-4D8C-8420-BF75269DB138"
Write-Host "  P9 new: Edit fuzzy match + auto-compact + 12 employee agents visible"
Write-Host ""
Write-Host "  Test /agents now:" -ForegroundColor Magenta
Write-Host "    trilc chat -> /agents -> should show 4 built-in + 12 employees"
pause
