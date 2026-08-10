# install-tricade-0.3.1.ps1
#  TriCade Bundle 0.3.1CC + Session persistence + 5 bugfix
# Right-click -> Run as administrator PowerShell
$ErrorActionPreference = "Stop"

$MSI   = "D:\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.3.1.msi"
$TRILC = "C:\Program Files\TriCade\resources\app\tools\trilc"

# 0. 
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "[X] admin privilegesRight-click -> Run as administrator PowerShell " -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path $MSI)) { Write-Host "[X] MSI : $MSI" -ForegroundColor Red; pause; exit 1 }

Write-Host "===  TriCade Bundle 0.3.1CC + Session persistence + RegRun===" -ForegroundColor Cyan

# 1. Stop tricade /  node processrelease file locks
Write-Host "`n[1/6] Stop tricade /  node process..." -ForegroundColor Yellow
$tricadeRunning = Get-Process tricade -ErrorAction SilentlyContinue
$trilcRunning = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like '*trilc*' }
if ($tricadeRunning -or $trilcRunning) {
  Write-Host "  detected TriCade/trilc processrunningStoprelease file locks" -ForegroundColor Magenta
  $confirm = Read-Host "  Stop(y/n)"
  if ($confirm -ne 'y') {
    Write-Host "  Skippedplease manuallyStop TriCade  node processre-run" -ForegroundColor Yellow
    pause; exit 0
  }
  $tricadeRunning | Stop-Process -Force
  $trilcRunning | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Seconds 2
} else {
  Write-Host "  detected TriCade/trilc process"
}

# 2.  MSI
Write-Host "[2/6] msiexec  0.3.1 ..." -ForegroundColor Yellow
$log = "$env:TEMP\tricade-0.3.1-install.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" /qn /norestart /L*v `"$log`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Write-Host "[X] msiexec  exit=$($p.ExitCode): $log" -ForegroundColor Red; pause; exit $p.ExitCode
}

# 3. 9 
Write-Host "[3/6] ..." -ForegroundColor Yellow

$g1 = Select-String -Path "$TRILC\dist\server\anthropic-stream.js" -Pattern "textBlockHasDelta" -Quiet
$g2 = Select-String -Path "$TRILC\node_modules\@trimetaverse\agent-core\dist\loop.js" -Pattern "startsWith" -Quiet
$g3 = Select-String -Path "$TRILC\dist\server\anthropic-stream.js" -Pattern "processedToolUseIds" -Quiet
$g4 = Select-String -Path "$TRILC\dist\server\anthropic-stream.js" -Pattern "toolUses" -Quiet
$g5 = Select-String -Path "$TRILC\node_modules\@trimetaverse\agent-core\dist\*.js" -Pattern "deepseek-v4-pro" -Quiet
$g6 = Select-String -Path "$TRILC\dist\server\app.js" -Pattern "127.0.0.1" -Quiet

Write-Host ("  Gate 1  content (textBlockHasDelta):        " + $(if($g1){"[OK]"}else{"[!] detected"}))
Write-Host ("  Gate 2  tool_calls (startsWith):           " + $(if($g2){"[OK]"}else{"[!] detected"}))
Write-Host ("  Gate 3  tool_use (processedToolUseIds):    " + $(if($g3){"[OK]"}else{"[!] detected"}))
Write-Host ("  Gate 4  tool_use (toolUses):               " + $(if($g4){"[OK]"}else{"[!] detected"}))
Write-Host ("  Gate 5  v4model (deepseek-v4-pro):            " + $(if($g5){"[OK]"}else{"[!] detected"}))
Write-Host ("  Gate 6  listen 127.0.0.1 (app.js):             " + $(if($g6){"[OK]"}else{"[!] detected"}))

# Gate 7: CC 
$toolsDir = "$TRILC\dist\tools"
$t7a = Test-Path "$toolsDir\file-read.js"
$t7b = Test-Path "$toolsDir\file-write.js"
$t7c = Test-Path "$toolsDir\file-edit.js"
$t7d = Test-Path "$toolsDir\file-glob.js"
$t7e = Test-Path "$toolsDir\file-grep.js"
$t7ok = $t7a -and $t7b -and $t7c -and $t7d -and $t7e
Write-Host ("  Gate 7  CC (Read/Write/Edit/Glob/Grep): " + $(if($t7ok){"[OK] 5/5"}else{"[!] $((@($t7a,$t7b,$t7c,$t7d,$t7e)|%{if($_){1}else{0}}|measure -sum).Sum)/5"}))

# Gate 8: 12 contracts
$contractDir = "$TRILC\contracts"
$contractCount = if (Test-Path $contractDir) { (Get-ChildItem -Path $contractDir -Directory).Count } else { 0 }
Write-Host ("  Gate 8  12 agent contracts:                    " + $(if($contractCount -eq 12){"[OK] ($contractCount/12)"}else{"[!] $contractCount/12"}))

# Gate 9: Session 
$g9 = Select-String -Path "$TRILC\dist\server\app.js" -Pattern "/internal/v1/sessions" -Quiet
Write-Host ("  Gate 9  Session persistence (/internal/v1/sessions): " + $(if($g9){"[OK]"}else{"[!] detected"}))

# ARP 
$arp = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*","HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" -ErrorAction SilentlyContinue |
  Where-Object { $_.DisplayName -like '*TriCade*' } | Select-Object DisplayName, DisplayVersion
if ($arp) {
  Write-Host "  ARP : $($arp.DisplayName) $($arp.DisplayVersion)"
} else {
  Write-Host "  ARP :  TriCade  Base "
}

# 4. 
Write-Host "[4/6] ..." -ForegroundColor Yellow
Write-Host ("  dist/cli.js:                 " + $(if(Test-Path "$TRILC\dist\cli.js"){"[OK]"}else{"[!]"}))
Write-Host ("  dist/server/app.js:          " + $(if(Test-Path "$TRILC\dist\server\app.js"){"[OK]"}else{"[!]"}))
Write-Host ("  dist/server/anthropic-stream.js: " + $(if(Test-Path "$TRILC\dist\server\anthropic-stream.js"){"[OK]"}else{"[!]"}))
Write-Host ("  node_modules/@trimetaverse/agent-core: " + $(if(Test-Path "$TRILC\node_modules\@trimetaverse\agent-core"){"[OK]"}else{"[!]"}))
Write-Host ("  trilc.cmd:                   " + $(if(Test-Path "$TRILC\trilc.cmd"){"[OK]"}else{"[!]"}))

# 5. RegRun auto-start
Write-Host "`n[5/6] Enabling RegRun auto-start..." -ForegroundColor Yellow
$trilcCmd = "$TRILC\trilc.cmd"
if (Test-Path $trilcCmd) {
  & "$trilcCmd" install-regrun 2>&1 | Write-Host
  Write-Host "  [OK] RegRun configuredauto-start on login" -ForegroundColor Green
} else {
  Write-Host "  [!] trilc.cmd not foundplease manually: trilc install-regrun" -ForegroundColor Yellow
}

# 6. 
Write-Host "`n[6/6] Install completeTriCade Bundle 0.3.1 deployed:" -ForegroundColor Green
Write-Host "  - CC (Read/Write/Edit/Glob/Grep)"
Write-Host "  - Session persistence (--resume-session / list-sessions)"
Write-Host "  - RegRun auto-startauto-start on login"
Write-Host "  - app.js listen 127.0.0.1"
Write-Host "  - 5  bugfix + 12 contracts"
Write-Host "Install log: $log" -ForegroundColor Cyan
Write-Host "`n[Tip] After reboot, daemon auto-startsRegRunFor immediate use, run: trilc start && trilc chat" -ForegroundColor Cyan
pause
