# install-tricade-0.2.8.ps1
# 以管理员身份运行：安装 TriCade Bundle 0.2.8（含 4 个 bug 修复）
# 用法：右键 -> 以管理员身份运行 PowerShell，执行本脚本
$ErrorActionPreference = "Stop"

$MSI   = "D:\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.2.8.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

# ── 0. 管理员检查 ──
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] 需要管理员权限。右键 -> 以管理员身份运行 PowerShell 再执行本脚本。" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI 不存在: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== 安装 TriCade Bundle 0.2.8（含 4 bug 修复）===" -ForegroundColor Cyan

# ── 1. 关 tricade / 相关 node 进程（释放文件锁）──
Write-Host "`n[1/4] 关闭 tricade / 相关 node 进程..." -ForegroundColor Yellow
Get-Process tricade -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

# ── 2. 安装 MSI ──
Write-Host "[2/4] msiexec 安装 0.2.8 ..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.2.8-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec 失败 exit=$($p.ExitCode)，日志: $log" -ForegroundColor Red; pause; exit $p.ExitCode
}

# ── 3. 验证安装 ──
Write-Host "[3/4] 验证..." -ForegroundColor Yellow
$ok1 = Select-String -Path "$TRILC\dist\server\anthropic-stream.js" -Pattern "textBlockHasDelta" -Quiet
$ok2 = Select-String -Path "$TRILC\dist\server\anthropic-stream.js" -Pattern "processedToolUseIds" -Quiet
$ok3 = Select-String -Path "$TRILC\node_modules\@trimetaverse\agent-core\dist\loop.js" -Pattern "startsWith" -Quiet
Write-Host ("  Bug1 content 去重 (textBlockHasDelta):       " + $(if($ok1){"[OK]"}else{"[!] 未检测到"}))
Write-Host ("  Bug4 tool_use 去重 (processedToolUseIds):   " + $(if($ok2){"[OK]"}else{"[!] 未检测到"}))
Write-Host ("  Bug2 tool_calls 合并 (agent-core startsWith):" + $(if($ok3){"[OK]"}else{"[!] 未检测到"}))
$arp = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*","HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" -ErrorAction SilentlyContinue |
  Where-Object { $_.DisplayName -like '*TriCade*' } | Select-Object DisplayName, DisplayVersion
Write-Host "  ARP 注册: $($arp.DisplayName) $($arp.DisplayVersion)"

# ── 4. 完成 ──
Write-Host "`n[4/4] 安装完成。请重新启动 TriCade（tricade.exe），trilc chat 即含全部 4 个修复。" -ForegroundColor Green
Write-Host "安装日志: $log" -ForegroundColor Cyan
pause
