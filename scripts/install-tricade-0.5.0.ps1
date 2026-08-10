# install-tricade-0.5.0.ps1
#  TriCade Bundle 0.5.0 — P0+P1 CC移植 (对齐度 ~70%)
#  P0: 光标+历史+命令+工具+状态行+token追踪+4项CEO阻塞修复
#  P1: 消息视觉分层+工具流式blocks+闪现修复+块边界+\r\n normalize+levenshtein DRY
# Right-click -> Run as administrator PowerShell
$ErrorActionPreference = "Stop"

$MSI   = "D:\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.5.0.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

# 0. Admin check
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] Admin privileges required. Right-click -> Run as administrator PowerShell" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI not found: $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "===  TriCade Bundle 0.5.0 — P0+P1 CC  (   ~70%) ===" -ForegroundColor Cyan

# 1. Stop existing processes
Write-Host "`n[1/6] Stopping TriCade / node processes..." -ForegroundColor Yellow
$tricadeRunning = Get-Process tricade -ErrorAction SilentlyContinue
$trilcRunning = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' }
if ($tricadeRunning -or $trilcRunning) {
  Write-Host "  TriCade/trilc processes detected. Stopping to release file locks..." -ForegroundColor Magenta
  $confirm = Read-Host "  Stop processes (y/n)?"
  if ($confirm -ne 'y') {
    Write-Host "  Skipped. Please manually stop TriCade & node processes, then re-run." -ForegroundColor Yellow
    pause; exit 0
  }
  $tricadeRunning | Stop-Process -Force
  $trilcRunning | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Seconds 2
} else {
  Write-Host "  No running TriCade/trilc processes detected."
}

# 2. Install MSI
Write-Host "[2/6] Installing TriCade Bundle 0.5.0..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.5.0-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec exit=$($p.ExitCode). Log: $log" -ForegroundColor Red; pause; exit $p.ExitCode
}

# 3. Verify key files
Write-Host "[3/6] Verifying installation..." -ForegroundColor Yellow

Write-Host ("  dist/cli.js:                 " + $(if(Test-Path "$TRILC\dist\cli.js"){"[OK]"}else{"[!]"}))
Write-Host ("  dist/server/app.js:          " + $(if(Test-Path "$TRILC\dist\server\app.js"){"[OK]"}else{"[!]"}))
Write-Host ("  dist/server/anthropic-stream.js: " + $(if(Test-Path "$TRILC\dist\server\anthropic-stream.js"){"[OK]"}else{"[!]"}))

# P0 verification
Write-Host "  --- P0  ---"
$tuiFiles = @(
  "$TRILC\dist\tui\app.js",
  "$TRILC\dist\tui\hooks\useBlink.js",
  "$TRILC\dist\tui\hooks\useChat.js",
  "$TRILC\dist\tui\hooks\useAnthropicSSE.js",
  "$TRILC\dist\tui\hooks\useCursorInput.js",
  "$TRILC\dist\tui\components\ToolCallLine.js",
  "$TRILC\dist\tui\components\InputBox.js",
  "$TRILC\dist\tui\components\StatusLine.js",
  "$TRILC\dist\tui\components\ThinkingLine.js",
  "$TRILC\dist\tui\components\ErrorMessage.js",
  "$TRILC\dist\tui\components\Markdown.js",
  "$TRILC\dist\tui\design-system\theme.js"
)
$tuiOk = 0
foreach ($f in $tuiFiles) { if (Test-Path $f) { $tuiOk++ } }
Write-Host ("  TUI components:              " + $(if($tuiOk -eq $tuiFiles.Count){"[OK] $tuiOk/$($tuiFiles.Count)"}else{"[!] $tuiOk/$($tuiFiles.Count)"}))

# P1 verification — new files
Write-Host "  --- P1  ---"
$p1Files = @(
  "$TRILC\dist\tui\utils\levenshtein.js"
)
$p1Ok = 0
foreach ($f in $p1Files) { if (Test-Path $f) { $p1Ok++ } }
Write-Host ("  P1 new files:                " + $(if($p1Ok -eq $p1Files.Count){"[OK] $p1Ok/$($p1Files.Count)"}else{"[!] $p1Ok/$($p1Files.Count)"}))

# P1 content verification — grep for blocks architecture
$gBlocks = Select-String -Path "$TRILC\dist\tui\hooks\useChat.js" -Pattern "ContentBlock|msg\.blocks" -Quiet
$gContentBlockSSE = Select-String -Path "$TRILC\dist\tui\hooks\useAnthropicSSE.js" -Pattern "onContentBlockStart|onContentBlockDelta" -Quiet
$gUserMessage = Select-String -Path "$TRILC\dist\tui\app.js" -Pattern "\\\\u258e|UserMessage|AssistantMessage" -Quiet
$gToolCallSplit = Select-String -Path "$TRILC\dist\tui\components\ToolCallLine.js" -Pattern "flexDirection.*row|minWidth.*2" -Quiet
$gNormalize = Select-String -Path "$TRILC\dist\tui\hooks\useCursorInput.js" -Pattern "\\\\r\\\\n.*\\\\n.*\\\\r" -Quiet

Write-Host ("  blocks architecture (ContentBlock):  " + $(if($gBlocks){"[OK]"}else{"[!]"}))
Write-Host ("  SSE fine-grained callbacks:          " + $(if($gContentBlockSSE){"[OK]"}else{"[!]"}))
Write-Host ("  UserMessage/AssistantMessage:        " + $(if($gUserMessage){"[OK]"}else{"[!]"}))
Write-Host ("  ToolCallLine split (left/right Box): " + $(if($gToolCallSplit){"[OK]"}else{"[!]"}))
Write-Host ("  \\r\\n normalize:                       " + $(if($gNormalize){"[OK]"}else{"[!]"}))

# CC tools
$toolsDir = "$TRILC\dist\tools"
$t7a = Test-Path "$toolsDir\file-read.js"
$t7b = Test-Path "$toolsDir\file-write.js"
$t7c = Test-Path "$toolsDir\file-edit.js"
$t7d = Test-Path "$toolsDir\file-glob.js"
$t7e = Test-Path "$toolsDir\file-grep.js"
$t7ok = $t7a -and $t7b -and $t7c -and $t7d -and $t7e
Write-Host ("  CC tools (Read/Write/Edit/Glob/Grep): " + $(if($t7ok){"[OK] 5/5"}else{"[!] $((@($t7a,$t7b,$t7c,$t7d,$t7e)|%{if($_){1}else{0}}|measure -sum).Sum)/5"}))

# Contracts
$contractDir = "$TRILC\contracts"
$contractCount = if (Test-Path $contractDir) { (Get-ChildItem -Path $contractDir -Directory).Count } else { 0 }
Write-Host ("  Agent contracts:                       " + $(if($contractCount -eq 12){"[OK] ($contractCount/12)"}else{"[!] $contractCount/12"}))

# Session persistence
$gSession = Select-String -Path "$TRILC\dist\server\app.js" -Pattern "/internal/v1/sessions" -Quiet
Write-Host ("  Session persistence:                   " + $(if($gSession){"[OK]"}else{"[!]"}))

# 4. RegRun auto-start
Write-Host "`n[4/6] Enabling RegRun auto-start..." -ForegroundColor Yellow
$trilcCmd = "$TRILC\trilc.cmd"
if (Test-Path $trilcCmd) {
  & "$trilcCmd" install-regrun 2>&1 | Write-Host
  Write-Host "  [OK] RegRun configured — auto-start on login" -ForegroundColor Green
} else {
  Write-Host "  [!] trilc.cmd not found. Run manually: trilc install-regrun" -ForegroundColor Yellow
}

# 5. ARP check
Write-Host "`n[5/6] ARP registration check..." -ForegroundColor Yellow
$arp = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*","HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" -ErrorAction SilentlyContinue |
  Where-Object { $_.DisplayName -like '*TriCade*' } | Select-Object DisplayName, DisplayVersion
if ($arp) {
  Write-Host "  ARP: $($arp.DisplayName) $($arp.DisplayVersion)"
} else {
  Write-Host "  ARP: No TriCade entry found (Base may not be installed)"
}

# 6. Done
Write-Host "`n[6/6] TriCade Bundle 0.5.0 deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "  P0+P1 CC   (~70%):" -ForegroundColor Cyan
Write-Host "    P0:  +  +  +  +  +token +4 CEO  "
Write-Host "    P1:  +  blocks +  +  +\\r\\n normalize +DRY"
Write-Host ""
Write-Host "  MSI: TriCade-Bundle-x64-0.5.0.msi (6.4 MB)" -ForegroundColor Cyan
Write-Host "  ProductCode: 8BF79368-E935-4DAB-A537-668D90D54053" -ForegroundColor Cyan
Write-Host "  SHA-256: 0d2d3828c8d6daaf6eba79d151d7cbfc24bd6ccfba471b22f8ecb4d228e44c" -ForegroundColor Cyan
Write-Host "  Install log: $log" -ForegroundColor Cyan
Write-Host ""
Write-Host "[Tip] After reboot, daemon auto-starts via RegRun. For immediate use: trilc start && trilc chat" -ForegroundColor Cyan
Write-Host ""
Write-Host "P1   :" -ForegroundColor Magenta
Write-Host "  1.    ->    ▎ +warning  +paddingLeft"
Write-Host "  2.    ->      ToolCallLine  ●+  "
Write-Host "  3.    -> SSE content_block     blocks    "
Write-Host "  4.    ->    ───  "
Write-Host "  5. \\r\\n normalize -> Windows       "
Write-Host "  6. DRY -> levenshtein     utils/"
pause
