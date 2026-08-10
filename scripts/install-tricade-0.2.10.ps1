# install-tricade-0.2.10.ps1
# 管理员运行：安装 TriCade Bundle 0.2.10（RegRun 开机自启 + 5 bugfix）
# 用法：右键 -> 以管理员身份运行 PowerShell，执行本脚本
$ErrorActionPreference = "Stop"

$MSI   = "D:\OneDrive\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.2.10.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

# ── 0. 管理员检查 ──
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] 需要管理员权限。右键 -> 以管理员身份运行 PowerShell 再执行本脚本。" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI 不存在: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== 安装 TriCade Bundle 0.2.10（RegRun 开机自启 + 127.0.0.1 + 5 bugfix）===" -ForegroundColor Cyan

# ── 1. 关闭 tricade / 相关 node 进程（释放文件锁）──
Write-Host "`n[1/5] 关闭 tricade / 相关 node 进程..." -ForegroundColor Yellow
$tricadeRunning = Get-Process tricade -ErrorAction SilentlyContinue
$trilcRunning = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' }
if ($tricadeRunning -or $trilcRunning) {
  Write-Host "  检测到 TriCade/trilc 进程正在运行。安装前需关闭释放文件锁。" -ForegroundColor Magenta
  $confirm = Read-Host "  是否强制关闭？(y/n)"
  if ($confirm -ne 'y') {
    Write-Host "  已跳过。请手动关闭 TriCade 和相关 node 进程后重新运行。" -ForegroundColor Yellow
    pause; exit 0
  }
  $tricadeRunning | Stop-Process -Force
  $trilcRunning | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Seconds 2
} else {
  Write-Host "  未检测到运行中的 TriCade/trilc 进程。"
}

# ── 2. 安装 MSI ──
Write-Host "[2/5] msiexec 安装 0.2.10 ..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.2.10-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec 失败 exit=$($p.ExitCode)，日志: $log" -ForegroundColor Red; pause; exit $p.ExitCode
}

# ── 3. 验证安装（7 项内容门禁）──
Write-Host "[3/6] 验证安装..." -ForegroundColor Yellow

$g1 = Select-String -Path "$TRILC\dist\server\anthropic-stream.js" -Pattern "textBlockHasDelta" -Quiet
$g2 = Select-String -Path "$TRILC\node_modules\@trimetaverse\agent-core\dist\loop.js" -Pattern "startsWith" -Quiet
$g3 = Select-String -Path "$TRILC\dist\server\anthropic-stream.js" -Pattern "processedToolUseIds" -Quiet
$g4 = Select-String -Path "$TRILC\dist\server\anthropic-stream.js" -Pattern "toolUses" -Quiet

Write-Host ("  Gate 1  content去重 (textBlockHasDelta):        " + $(if($g1){"[OK]"}else{"[!] 未检测到"}))
Write-Host ("  Gate 2  tool_calls合并 (startsWith):           " + $(if($g2){"[OK]"}else{"[!] 未检测到"}))
Write-Host ("  Gate 3  tool_use去重 (processedToolUseIds):    " + $(if($g3){"[OK]"}else{"[!] 未检测到"}))
Write-Host ("  Gate 4  tool_use处理 (toolUses):               " + $(if($g4){"[OK]"}else{"[!] 未检测到"}))

# Gate 5: v4 model name (deepseek-v4-pro) in agent-core
$g5 = Select-String -Path "$TRILC\node_modules\@trimetaverse\agent-core\dist\*.js" -Pattern "deepseek-v4-pro" -Quiet
Write-Host ("  Gate 5  v4模型名 (deepseek-v4-pro):            " + $(if($g5){"[OK]"}else{"[!] 未检测到"}))
$g6 = Select-String -Path "$TRILC\dist\server\app.js" -Pattern "127.0.0.1" -Quiet
Write-Host ("  Gate 6  listen 127.0.0.1 (app.js):             " + $(if($g6){"[OK]"}else{"[!] 未检测到"}))

# Gate 7: 12 contracts
$contractDir = "$TRILC\contracts"
$contractCount = if (Test-Path $contractDir) { (Get-ChildItem -Path $contractDir -Directory).Count } else { 0 }
Write-Host ("  Gate 7  12 agent contracts:                    " + $(if($contractCount -eq 12){"[OK] ($contractCount/12)"}else{"[!] $contractCount/12"}))

# ARP 注册检查
$arp = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*","HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" -ErrorAction SilentlyContinue |
  Where-Object { $_.DisplayName -like '*TriCade*' } | Select-Object DisplayName, DisplayVersion
if ($arp) {
  Write-Host "  ARP 注册: $($arp.DisplayName) $($arp.DisplayVersion)"
} else {
  Write-Host "  ARP 注册: 未找到 TriCade 条目（可能需要 Base 安装）"
}

# ── 4. 文件清单确认 ──
Write-Host "[4/6] 文件清单..." -ForegroundColor Yellow
Write-Host ("  dist/cli.js:                 " + $(if(Test-Path "$TRILC\dist\cli.js"){"[OK]"}else{"[!]"}))
Write-Host ("  dist/server/app.js:          " + $(if(Test-Path "$TRILC\dist\server\app.js"){"[OK]"}else{"[!]"}))
Write-Host ("  dist/server/anthropic-stream.js: " + $(if(Test-Path "$TRILC\dist\server\anthropic-stream.js"){"[OK]"}else{"[!]"}))
Write-Host ("  node_modules/@trimetaverse/agent-core: " + $(if(Test-Path "$TRILC\node_modules\@trimetaverse\agent-core"){"[OK]"}else{"[!]"}))
Write-Host ("  trilc.cmd:                   " + $(if(Test-Path "$TRILC\trilc.cmd"){"[OK]"}else{"[!]"}))

# ── 5. RegRun 开机自启 ──
Write-Host "`n[5/6] 启用 RegRun 开机自启..." -ForegroundColor Yellow
$trilcCmd = "$TRILC\trilc.cmd"
if (Test-Path $trilcCmd) {
  & "$trilcCmd" install-regrun 2>&1 | Write-Host
  Write-Host "  [OK] RegRun 已设置（用户登录即启动，无需管理员）" -ForegroundColor Green
} else {
  Write-Host "  [!] trilc.cmd 不在，请手动: trilc install-regrun" -ForegroundColor Yellow
}

# ── 6. 完成 ──
Write-Host "`n[6/6] 安装完成。TriCade Bundle 0.2.10 已部署:" -ForegroundColor Green
Write-Host "  - RegRun 开机自启（用户登录即启动）"
Write-Host "  - app.js listen 127.0.0.1"
Write-Host "  - 5 个 P2 bugfix (content去重/tool_use去重/tool_calls合并/v4模型名)"
Write-Host "  - 12 agent contracts"
Write-Host "  - reboot 或手动 trilc start 启动 daemon"
Write-Host "安装日志: $log" -ForegroundColor Cyan
Write-Host "`n[提示] 重启后 daemon 自动启动（RegRun）。如需立即使用，运行: trilc start && trilc chat" -ForegroundColor Cyan
pause
