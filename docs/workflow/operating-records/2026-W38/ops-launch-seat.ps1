# launch-seat.ps1 — 单席干净环境启动器（清 CLAUDE* 遗传变量后按正名形态 resume）
param(
  [Parameter(Mandatory=$true)][string]$Name,      # 如 m-cao
  [Parameter(Mandatory=$true)][string]$Agent,     # PascalCase 正名，如 ChiefAdministrativeOfficer
  [Parameter(Mandatory=$true)][string]$Manual     # kebab 手册名，如 chief-administrative-officer
)
Remove-Item Env:CLAUDE_CODE_CHILD_SESSION -ErrorAction SilentlyContinue
Get-ChildItem Env: | Where-Object Name -like "CLAUDE*" | Remove-Item -ErrorAction SilentlyContinue
$env:CLAUDE_CODE_FORCE_SESSION_PERSISTENCE = "1"
Set-Location D:\Code\ai\TriMetaverse
claude --resume $Name -n $Name --agent $Agent --verbose --dangerously-skip-permissions --append-system-prompt-file "D:/Code/ai/TriMetaverse/.claude/hub/$Manual.session.md"
