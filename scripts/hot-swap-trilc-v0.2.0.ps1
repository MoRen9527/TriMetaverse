# hot-swap-trilc-v0.2.0.ps1
# 热替换安装版 trilc daemon 到 v0.2.0（含 4 个 bug 修复：content 重复 / tool_calls 累积 / Turn-2 连锁 / converter 重复开块）
# 用法：右键 -> 以管理员身份运行 PowerShell，执行本脚本
$ErrorActionPreference = "Stop"

$SRC = "D:\Code\ai\TriMetaverse\output\TriMetaverse-Desktop-v0.2.0-windows\trilc"
$DST = "C:\Program Files\TriCade\resources\app\tools\trilc"
$BAK = "C:\Program Files\TriCade\resources\app\tools\trilc.bak-v0.1.0"

# ── 0. 管理员检查 ──
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
  Write-Host "[X] 需要管理员权限。请右键 -> 以管理员身份运行 PowerShell 再执行本脚本。" -ForegroundColor Red
  pause; exit 1
}

if (-not (Test-Path "$SRC\dist\server\app.js")) { Write-Host "[X] 替换源不存在: $SRC" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $DST)) { Write-Host "[X] 安装版 trilc 不存在: $DST" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== trilc 热替换到 v0.2.0（含修复）===" -ForegroundColor Cyan

# ── 1. 停 tricade（释放 dist 文件锁）──
Write-Host "`n[1/5] 停止 tricade.exe（释放 dist 锁）..." -ForegroundColor Yellow
Get-Process tricade -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# ── 2. 备份现有 ──
Write-Host "[2/5] 备份现有 trilc -> $BAK" -ForegroundColor Yellow
if (Test-Path $BAK) { Remove-Item -Recurse -Force $BAK }
Copy-Item -Recurse $DST $BAK

# ── 3. 热替换（dist + node_modules + package.json）──
Write-Host "[3/5] 热替换 trilc..." -ForegroundColor Yellow
robocopy $SRC $DST /MIR /NFL /NDL /NJH /NJS /R:1 /W:1 | Out-Null
if ($LASTEXITCODE -gt 7) { Write-Host "[X] robocopy 失败 (exit $LASTEXITCODE)，已从备份回滚" -ForegroundColor Red; Copy-Item -Recurse -Force $BAK $DST; pause; exit 1 }

# ── 4. 验证修复标志 ──
Write-Host "[4/5] 验证修复..." -ForegroundColor Yellow
$ok1 = Select-String -Path "$DST\dist\server\anthropic-stream.js" -Pattern "textBlockHasDelta" -Quiet
$ok2 = Select-String -Path "$DST\dist\server\anthropic-stream.js" -Pattern "processedToolUseIds" -Quiet
$ok3 = Select-String -Path "$DST\node_modules\@trimetaverse\agent-core\dist\loop.js" -Pattern "startsWith" -Quiet
Write-Host ("  Bug1 content 去重 (textBlockHasDelta):      " + $(if($ok1){"✅"}else{"⚠️"}))
Write-Host ("  Bug4 tool_use 去重 (processedToolUseIds):  " + $(if($ok2){"✅"}else{"⚠️"}))
Write-Host ("  Bug2 tool_calls 合并 (agent-core startsWith):" + $(if($ok3){"✅"}else{"⚠️"}))

# ── 5. 完成提示 ──
Write-Host "`n[5/5] 完成。请重新启动 TriCade（tricade.exe）让新 trilc 生效。" -ForegroundColor Green
Write-Host "回滚：把 '$BAK' 重命名回 'trilc' 即可（先停 tricade）。" -ForegroundColor Cyan
pause
