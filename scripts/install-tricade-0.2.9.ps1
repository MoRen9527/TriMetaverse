# install-tricade-0.2.9.ps1
# 以管理员身份运行：安装 TriCade Bundle 0.2.9（S2 Dev 修复 + nssm 服务封装）
# 用法：右键 -> 以管理员身份运行 PowerShell，执行本脚本
$ErrorActionPreference = "Stop"

$MSI   = "D:\OneDrive\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.2.9.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"
$NSSM  = "C:\Program Files\TriCade\resources\app\tools\nssm\nssm.exe"

# ── 0. 管理员检查 ──
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] 需要管理员权限。右键 -> 以管理员身份运行 PowerShell 再执行本脚本。" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI 不存在: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "=== 安装 TriCade Bundle 0.2.9（S2 Dev: nssm + 127.0.0.1 + 5 bugfix）===" -ForegroundColor Cyan

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
Write-Host "[2/5] msiexec 安装 0.2.9 ..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.2.9-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" INSTALL_TRILC_SERVICE=1 /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec 失败 exit=$($p.ExitCode)，日志: $log" -ForegroundColor Red; pause; exit $p.ExitCode
}

# ── 3. 验证安装（6 项内容门禁）──
Write-Host "[3/5] 验证安装..." -ForegroundColor Yellow

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

# Gate 6: nssm.exe 内置于 tools/nssm/
Write-Host ("  Gate 6  nssm.exe (tools/nssm/):                " + $(if(Test-Path $NSSM){"[OK]"}else{"[!] 未检测到"}))
if (Test-Path $NSSM) {
  $nssmSize = (Get-Item $NSSM).Length
  Write-Host ("          nssm.exe size: $nssmSize bytes (expect ~331,264)")
}

# Gate 7: cli.js 含 toShortPath (8.3 短路径生成)
$g7 = Select-String -Path "$TRILC\dist\cli.js" -Pattern "toShortPath" -Quiet
Write-Host ("  Gate 7  toShortPath (cli.js, 8.3 短路径):      " + $(if($g7){"[OK]"}else{"[!] 未检测到"}))

# Gate 8: app.js listen 绑 127.0.0.1
$g8 = Select-String -Path "$TRILC\dist\server\app.js" -Pattern "127.0.0.1" -Quiet
Write-Host ("  Gate 8  listen 127.0.0.1 (app.js):             " + $(if($g8){"[OK]"}else{"[!] 未检测到"}))

# Gate 9: 12 contracts
$contractDir = "$TRILC\contracts"
$contractCount = if (Test-Path $contractDir) { (Get-ChildItem -Path $contractDir -Directory).Count } else { 0 }
Write-Host ("  Gate 9  12 agent contracts:                    " + $(if($contractCount -eq 12){"[OK] ($contractCount/12)"}else{"[!] $contractCount/12"}))

# ARP 注册检查
$arp = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*","HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" -ErrorAction SilentlyContinue |
  Where-Object { $_.DisplayName -like '*TriCade*' } | Select-Object DisplayName, DisplayVersion
if ($arp) {
  Write-Host "  ARP 注册: $($arp.DisplayName) $($arp.DisplayVersion)"
} else {
  Write-Host "  ARP 注册: 未找到 TriCade 条目（可能需要 Base 安装）"
}

# ── 4. 文件清单确认 ──
Write-Host "[4/5] 文件清单..." -ForegroundColor Yellow
Write-Host ("  dist/cli.js:                 " + $(if(Test-Path "$TRILC\dist\cli.js"){"[OK]"}else{"[!]"}))
Write-Host ("  dist/server/app.js:          " + $(if(Test-Path "$TRILC\dist\server\app.js"){"[OK]"}else{"[!]"}))
Write-Host ("  dist/server/anthropic-stream.js: " + $(if(Test-Path "$TRILC\dist\server\anthropic-stream.js"){"[OK]"}else{"[!]"}))
Write-Host ("  node_modules/@trimetaverse/agent-core: " + $(if(Test-Path "$TRILC\node_modules\@trimetaverse\agent-core"){"[OK]"}else{"[!]"}))
Write-Host ("  tools/nssm/nssm.exe:        " + $(if(Test-Path $NSSM){"[OK]"}else{"[!]"}))
Write-Host ("  trilc.cmd:                   " + $(if(Test-Path "$TRILC\trilc.cmd"){"[OK]"}else{"[!]"}))

# ── 5. 完成 ──
Write-Host "`n[5/5] 安装完成。TriCade Bundle 0.2.9 已部署:" -ForegroundColor Green
Write-Host "  - nssm 服务封装 (toShortPath 8.3 路径)"
Write-Host "  - app.js listen 127.0.0.1"
Write-Host "  - 5 个 P2 bugfix (content去重/tool_use去重/tool_calls合并/v4模型名)"
Write-Host "  - 12 agent contracts"
Write-Host "  - nssm.exe 内置于 tools/nssm/"
Write-Host "请重新启动 TriCade（tricade.exe）。" -ForegroundColor Cyan
Write-Host "安装日志: $log" -ForegroundColor Cyan
pause
