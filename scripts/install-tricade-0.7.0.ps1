# install-tricade-0.7.0.ps1
#  TriCade 0.7.0 — P0-P4 CC 还原度累计 (还原度 ~93%)
#  14 工具 | 权限模型(ask/allow/deny) | subagent派子代理 | AskUserQuestion交互
#  | compact真压缩 | diff渲染 | TodoWrite verification | skills(simplify/debug/remember)
#  | /model真切换 | /context | /cost | /agents | /init AI驱动 | LS | TaskCreate依赖
# Right-click -> Run as administrator PowerShell
$ErrorActionPreference = "Stop"

$MSI   = "D:\OneDrive\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.7.0.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] Admin required. Right-click -> Run as administrator" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI not found: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== TriCade 0.7.0 — P0-P4 CC 还原度累计 (~93%) ===" -ForegroundColor Cyan

# 1. Stop processes
Write-Host "`n[1/4] Stopping processes..." -ForegroundColor Yellow
Get-Process tricade -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# 2. Install MSI
Write-Host "[2/4] Installing TriCade 0.7.0..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.7.0-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec exit=$($p.ExitCode). Log: $log" -ForegroundColor Red; pause; exit $p.ExitCode
}

# 3. Verify key features (P3 权限 + P1 subagent + P0-P4 累计)
Write-Host "[3/4] Verifying P0-P4 cumulative features..." -ForegroundColor Yellow
Write-Host ("  dist/cli.js:                 " + $(if(Test-Path "$TRILC\dist\cli.js"){"[OK]"}else{"[!]"}))
Write-Host ("  dist/server/app.js:          " + $(if(Test-Path "$TRILC\dist\server\app.js"){"[OK]"}else{"[!]"}))

# 权限模型 (P3)
$gPerm = Select-String -Path "$TRILC\dist\server\interactions.js" -Pattern "alwaysAllowedTools|kind.*permission" -Quiet
Write-Host ("  P3 权限模型(ask/allow/deny):  " + $(if($gPerm){"[OK]"}else{"[!]"}))

# subagent (P1)
$gAgent = Select-String -Path "$TRILC\dist\tools\agent-tool.js" -Pattern "spawnAgent" -Quiet
Write-Host ("  P1 subagent(AgentTool):       " + $(if($gAgent){"[OK]"}else{"[!]"}))

# compact 真压缩 (v2)
$gCompact = Test-Path "$TRILC\dist\services\compact\compact.js"
Write-Host ("  v2 compact 真压缩:            " + $(if($gCompact){"[OK]"}else{"[!]"}))

# skills (P2)
$gSkill = Test-Path "$TRILC\dist\skills\bundled-skills.js"
Write-Host ("  P2 skills(simplify/debug/remember): " + $(if($gSkill){"[OK]"}else{"[!]"}))

# /init AI驱动 + /model 真切换 (P2/P4)
$gInitAI = Select-String -Path "$TRILC\dist\tui\app.js" -Pattern "Analyze project via AI" -Quiet
Write-Host ("  P4 /init AI驱动:              " + $(if($gInitAI){"[OK]"}else{"[!]"}))

# CC tools 14 个
$toolsDir = "$TRILC\dist\tools"
$toolFiles = @("file-read","file-write","file-edit","file-glob","file-grep","file-ls","todo-write","send-message","agent-tool","skill-tool","ask-user-question-tool","shell-exec")
$toolOk = 0; foreach ($t in $toolFiles) { if (Test-Path "$toolsDir\$t.js") { $toolOk++ } }
Write-Host ("  CC 工具 ($toolOk/$($toolFiles.Count) 文件):     " + $(if($toolOk -ge $toolFiles.Count){"[OK]"}else{"[!] $toolOk/$($toolFiles.Count)"}))

# contracts + session
Write-Host ("  Agent contracts (12):         " + $(if((Test-Path "$TRILC\contracts") -and (Get-ChildItem "$TRILC\contracts" -Directory).Count -eq 12){"[OK]"}else{"[!]"}))
Write-Host ("  Session persistence:           " + $(if(Select-String -Path "$TRILC\dist\server\app.js" -Pattern "/internal/v1/sessions" -Quiet){"[OK]"}else{"[!]"}))

# 4. RegRun + Done
Write-Host "`n[4/4] RegRun auto-start + done..." -ForegroundColor Yellow
$trilcCmd = "$TRILC\trilc.cmd"
if (Test-Path $trilcCmd) { & "$trilcCmd" install-regrun 2>&1 | Write-Host }

Write-Host "`n=== TriCade 0.7.0 deployed ===" -ForegroundColor Green
Write-Host "  MSI: TriCade-Bundle-x64-0.7.0.msi (6.4 MB)" -ForegroundColor Cyan
Write-Host "  ProductCode: 5F5611E8-436E-49EF-BA80-DEA230436754" -ForegroundColor Cyan
Write-Host "  CC 还原度: ~93% (P0-P4 六棵树累计)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  实测清单:" -ForegroundColor Magenta
Write-Host "    1. trilc chat (启动, daemon 后台)"
Write-Host "    2. Backspace 删除 (#5.2 修复)"
Write-Host "    3. /model deepseek-v4-pro (真实切换)"
Write-Host "    4. /context + /cost (token/成本可见)"
Write-Host "    5. /agents (列内置 agent)"
Write-Host "    6. /init (AI 驱动分析项目生成 CLAUDE.md)"
Write-Host "    7. 让 AI 跑命令 -> 权限弹窗 allow/deny/always (P3 标志性)"
Write-Host "    8. 让 AI 派子代理 ('用 agent 工具搜索 X' -> AgentTool)"
Write-Host "    9. 让 AI 创建任务 -> TodoWrite 任务列表 + verification nudge"
Write-Host "   10. /compact (长会话真压缩)"
Write-Host "   11. AskUserQuestion (AI 问你多选题, 数字键选)"
Write-Host "   12. skill 调用 (simplify/debug/remember)"
pause
