# verify-trilc-service-s0.ps1
# S0 技术验证：用 INSTALL_TRILC_SERVICE=1 重装 TriCade Bundle 0.2.8，
# 验证 TriRLC Windows Service 注册、运行时、崩溃恢复。
#
# 必须以管理员身份运行（右键 PowerShell -> 以管理员身份运行）。
# 脚本会：卸载现有 0.2.8 -> 全新安装传 INSTALL_TRILC_SERVICE=1 -> 逐项验证。
# 卸载是必须的：WiX CA 条件为 INSTALL_TRILC_SERVICE="1" AND NOT Installed，
# 维护模式（同版本覆盖）下 Installed=1，CA 不触发。
#
# 用法（管理员 PowerShell）：
#   cd D:\Code\ai\TriMetaverse\scripts
#   .\verify-trilc-service-s0.ps1
# 可选跳过崩溃恢复测试（省 90s）：
#   .\verify-trilc-service-s0.ps1 -SkipCrashTest

param(
  [switch]$SkipCrashTest,
  [switch]$SkipUninstall  # 仅当确认当前为干净状态（0.2.8 未装）时使用
)

$ErrorActionPreference = "Continue"

# ── 常量 ──
$ServiceName  = "TriRLC"
$ExpectedPort = 8711
$MSI          = "D:\Code\ai\vscodium\build\windows\msi\releasedir\TriCade-Bundle-x64-0.2.8.msi"
$Stamp        = Get-Date -Format "yyyyMMdd-HHmmss"
$LogFile      = "$env:TEMP\verify-trilc-s0-$Stamp.log"
$SysDataDir   = "$env:windir\System32\config\systemprofile\AppData\Local\trirlc"

$Results = [System.Collections.ArrayList]::new()

function Log {
  param([string]$Msg, [string]$Color = "White")
  Write-Host $Msg -ForegroundColor $Color
  Add-Content -Path $LogFile -Value $Msg -Encoding UTF8
}

function Record {
  param([string]$Item, [string]$Expected, [string]$Actual, [string]$Verdict)
  $Results.Add([pscustomobject]@{ Item=$Item; Expected=$Expected; Actual=$Actual; Verdict=$Verdict }) | Out-Null
  $c = if ($Verdict -eq "PASS") {"Green"} elseif ($Verdict -eq "FAIL") {"Red"} else {"Yellow"}
  Log ("  [{0,-4}] {1}" -f $Verdict, $Item) $c
  Log ("        expected : $Expected") "DarkGray"
  Log ("        actual   : $Actual") "DarkGray"
}

# ── Phase 0: 预检（硬性前置，失败即退出）──
Log "==============================================" "Cyan"
Log " S0 TriRLC 服务化验证  $Stamp" "Cyan"
Log "==============================================" "Cyan"
Log "[Phase 0] 预检..." "Yellow"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Log "[X] 必须以管理员身份运行。右键 PowerShell -> 以管理员身份运行。" "Red"; Read-Host "回车退出"; exit 1 }
Record "管理员权限" "yes" "yes" "PASS"

if (-not (Test-Path $MSI)) { Record "MSI 存在" $MSI "NOT FOUND" "FAIL"; Read-Host "回车退出"; exit 1 }
Record "MSI 存在" "存在" $MSI "PASS"

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) { Record "Node.js on PATH" "node" "NOT FOUND" "FAIL"; Read-Host "回车退出"; exit 1 }
$nodeVer = (& node --version 2>$null)
$nodeOk = $nodeVer -match 'v(\d+)' -and [int]$Matches[1] -ge 22
Record "Node.js 版本 (需>=22, node:sqlite)" ">=v22" "$nodeVer ($($nodeCmd.Source))" ($(if($nodeOk){"PASS"}else{"FAIL"}))
if (-not $nodeOk) { Read-Host "回车退出"; exit 1 }

# 记录验证前状态
$preSvc = sc.exe query $ServiceName 2>&1
$preSvcAbsent = ($LASTEXITCODE -ne 0)
Record "验证前服务状态" "absent" ($(if($preSvcAbsent){"absent (1060)"}else{"已存在"})) ($(if($preSvcAbsent){"PASS"}else{"WARN"}))

# ── Phase 1: 卸载现有 0.2.8（确保重装时 NOT Installed=TRUE）──
Log "`n[Phase 1] 卸载现有 0.2.8 ..." "Yellow"
if ($SkipUninstall) {
  Log "  (-SkipUninstall 已指定，跳过卸载。仅当确认当前未装 0.2.8 时安全。)" "DarkYellow"
  Record "卸载 0.2.8" "skip" "-SkipUninstall" "WARN"
} else {
  $unlog = "$env:TEMP\verify-trilc-s0-uninstall-$Stamp.log"
  $p = Start-Process msiexec.exe -ArgumentList "/x `"$MSI`" /qn /norestart /L*v `"$unlog`"" -Wait -PassThru
  # 1605 = 产品未安装（也算 OK，允许在干净机器上跑）
  if ($p.ExitCode -eq 0 -or $p.ExitCode -eq 3010 -or $p.ExitCode -eq 1605) {
    Record "卸载 0.2.8" "exit 0/3010/1605" "exit $($p.ExitCode)" "PASS"
  } else {
    Record "卸载 0.2.8" "exit 0/3010/1605" "exit $($p.ExitCode)" "FAIL"
    Log "  卸载日志: $unlog" "DarkGray"
  }
  Start-Sleep -Seconds 4
}

# ── Phase 2: 全新安装，传 INSTALL_TRILC_SERVICE=1 ──
Log "`n[Phase 2] 全新安装 0.2.8 并传 INSTALL_TRILC_SERVICE=1 ..." "Yellow"
$inlog = "$env:TEMP\verify-trilc-s0-install-$Stamp.log"
$p = Start-Process msiexec.exe -ArgumentList "/i `"$MSI`" INSTALL_TRILC_SERVICE=1 /qn /norestart /L*v `"$inlog`"" -Wait -PassThru
if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
  Record "安装 (INSTALL_TRILC_SERVICE=1)" "exit 0/3010" "exit $($p.ExitCode)" "FAIL"
  Log "  安装日志: $inlog" "DarkGray"
  Log "  检查日志中 InstallTriLCService / TriCade Base prerequisite" "DarkGray"
  Read-Host "回车退出"; exit 1
}
Record "安装 (INSTALL_TRILC_SERVICE=1)" "exit 0/3010" "exit $($p.ExitCode)" "PASS"
# delayed-auto 启动可能晚几秒，给足时间
Log "  等待 delayed-auto 服务启动 (10s)..." "DarkGray"
Start-Sleep -Seconds 10

# ── Phase 3: 服务注册验证 ──
Log "`n[Phase 3] 验证服务注册..." "Yellow"

$q = sc.exe query $ServiceName 2>&1
if ($LASTEXITCODE -ne 0) {
  Record "服务注册" "注册成功" "未注册 (sc query 失败)" "FAIL"
  Log "  -> CA 未触发。确认 Phase 1 是否真的卸载（NOT Installed 才会触发 CA）。" "DarkGray"
  Log "  -> 安装日志: $inlog，搜 'InstallTriLCService' / 'Return value 3'" "DarkGray"
  Read-Host "回车退出"; exit 1
}
Record "服务注册" "成功" "已注册" "PASS"

# 状态
$stateLine = (($q -split "`n") | Where-Object { $_ -match "STATE" } | Select-Object -First 1).Trim()
Record "服务状态" "RUNNING" $stateLine ($(if($stateLine -match "RUNNING"){"PASS"}else{"FAIL"}))

# 启动类型：sc qc 看 START_TYPE，注册表看 DelayedAutostart
$qc = sc.exe qc $ServiceName 2>&1
$startLine = (($qc -split "`n") | Where-Object { $_ -match "START_TYPE" } | Select-Object -First 1).Trim()
$regKey = "HKLM:\SYSTEM\CurrentControlSet\Services\$ServiceName"
$startVal = (Get-ItemProperty $regKey -ErrorAction SilentlyContinue).Start
$delayedVal = (Get-ItemProperty $regKey -Name DelayedAutostart -ErrorAction SilentlyContinue).DelayedAutostart
$startSummary = "Start=$startVal DelayedAutostart=$delayedVal"
# Start=2 (AUTO_START) + DelayedAutostart=1 (delayed) = delayed-auto
$startOk = ($startVal -eq 2 -and $delayedVal -eq 1)
Record "启动类型 (delayed-auto)" "Start=2 + Delayed=1" $startSummary ($(if($startOk){"PASS"}else{"FAIL"}))

# failure recovery
$qf = sc.exe qfailure $ServiceName 2>&1
$qfCompact = (($qf -split "`n") | Where-Object { $_ -match "RESET_PERIOD|FAILURE_ACTION" } | ForEach-Object { $_.Trim() }) -join " | "
$failOk = ($qf -join " " -match "60000" -and $qf -join " " -match "RESTART")
Record "Failure Recovery" "restart/60000 x3, reset=86400" $qfCompact ($(if($failOk){"PASS"}else{"FAIL"}))

# 进程身份
$svcPidStr = (($q -split "`n") | Where-Object { $_ -match "PID" } | Select-Object -First 1) -replace ".*:\s*",""
$svcPidStr = $svcPidStr.Trim()
$procIdent = "n/a (no PID)"
if ($svcPidStr -match "^\d+$") {
  $wmi = Get-CimInstance Win32_Process -Filter "ProcessId=$svcPidStr" -ErrorAction SilentlyContinue
  if ($wmi) {
    $own = Invoke-CimMethod -InputObject $wmi -MethodName GetOwner -ErrorAction SilentlyContinue
    $procIdent = "$($own.Domain)\$($own.User) (pid=$svcPidStr)"
  }
}
Record "进程身份" "NT AUTHORITY\SYSTEM" $procIdent ($(if($procIdent -match "SYSTEM"){"PASS"}else{"FAIL"}))

# binPath 核查
$binPathLine = (($qc -split "`n") | Where-Object { $_ -match "BINARY_PATH_NAME" } | Select-Object -First 1) -replace ".*:\s*",""
$binPathLine = $binPathLine.Trim()
Record "binPath 构造" 'node ...cli.js run' $binPathLine ($(if($binPathLine -match "cli\.js.*run"){"PASS"}else{"WARN"}))

# ── Phase 4: 运行时验证 ──
Log "`n[Phase 4] 验证运行时..." "Yellow"

# 端口监听
$portLines = netstat -ano | Select-String ":$ExpectedPort\s+.*LISTENING"
if (-not $portLines) {
  Record "端口监听" ":$ExpectedPort LISTENING" "未监听（服务可能未起来或崩溃）" "FAIL"
} else {
  $listenAddr = ($portLines[0].Line -split "\s+")[1]
  $listenPid = ($portLines[0].Line -split "\s+")[-1]
  $isLoopback = ($listenAddr -match "^127\.0\.0\.1:" -or $listenAddr -match "^\[?::1\]?:")
  Record "端口监听地址" "127.0.0.1:$ExpectedPort (loopback)" "$listenAddr pid=$listenPid" ($(if($isLoopback){"PASS"}else{"WARN"}))
  if (-not $isLoopback) {
    Log "  [!] 实测非 loopback！app.ts:1702 server.listen(port) 未传 host，Node 默认绑 0.0.0.0/[::]，LAN 可达。" "Red"
    Log "      这是已知安全风险（S2 修：cli.ts binPath 或 app.ts 显式绑 127.0.0.1）。" "DarkYellow"
  }
}

# healthz
try {
  $resp = Invoke-RestMethod -Uri "http://127.0.0.1:$ExpectedPort/healthz" -TimeoutSec 5 -ErrorAction Stop
  $healthJson = $resp | ConvertTo-Json -Compress
  Record "GET /healthz" "{ok:true,service:trilc}" $healthJson ($(if($resp.ok -and $resp.service -eq "trilc"){"PASS"}else{"FAIL"}))
} catch {
  Record "GET /healthz" "{ok:true}" "请求失败: $($_.Exception.Message)" "FAIL"
}

# 数据目录（SYSTEM profile）
$dataExists = Test-Path $SysDataDir
$dataFiles = "n/a"
if ($dataExists) {
  $files = Get-ChildItem $SysDataDir -Recurse -File -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
  $dataFiles = ($files -join ",")
}
Record "SYSTEM 数据目录可写" "$SysDataDir 存在 + db 落盘" $("exists=$dataExists files=$dataFiles") ($(if($dataExists -and ($dataFiles -match "db")){"PASS"}elseif($dataExists){"WARN"}else{"FAIL"}))
if ($dataExists -and ($dataFiles -notmatch "keys\.json")) {
  Log "  (注：keys.json 未生成 — TriModel API 127.0.0.1:3333 未跑时属正常，key 拉取失败不阻塞服务)" "DarkGray"
}
Log "  (注：服务 cwd=$env:windir\System32，contract resolver 预期 0 agents，env.cwd 预期 System32 — 已知 S0 限制，S2 修)" "DarkGray"

# ── Phase 5: 崩溃恢复测试 ──
if ($SkipCrashTest) {
  Log "`n[Phase 5] 崩溃恢复测试已跳过 (-SkipCrashTest)" "DarkYellow"
  Record "崩溃自动恢复" "skip" "-SkipCrashTest" "WARN"
} elseif ($svcPidStr -notmatch "^\d+$") {
  Log "`n[Phase 5] 崩溃恢复测试：无有效 PID，跳过" "DarkYellow"
  Record "崩溃自动恢复" "新 PID 拉起" "无有效 PID，跳过" "WARN"
} else {
  Log "`n[Phase 5] 崩溃恢复测试（taskkill 进程，验 failure actions 自动拉起）..." "Yellow"
  Log "  说明：sc stop 是优雅停止，不触发 failure recovery；必须 taskkill /F 杀进程才触发。" "DarkGray"
  Log "  杀掉服务进程 PID=$svcPidStr ..." "Gray"
  $oldPid = $svcPidStr
  Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue

  $recovered = $false
  $newPid = ""
  for ($i = 1; $i -le 18; $i++) {  # 18 * 5s = 90s，覆盖 60s restart delay + 余量
    Start-Sleep -Seconds 5
    $q2 = sc.exe query $ServiceName 2>&1
    $st = (($q2 -split "`n") | Where-Object { $_ -match "STATE" } | Select-Object -First 1).Trim()
    $np = ((($q2 -split "`n") | Where-Object { $_ -match "PID" } | Select-Object -First 1) -replace ".*:\s*","").Trim()
    Log "    [+$($i*5)s] $st pid=$np" "DarkGray"
    if ($st -match "RUNNING" -and $np -match "^\d+$" -and $np -ne $oldPid) {
      $recovered = $true
      $newPid = $np
      break
    }
  }
  if ($recovered) {
    Record "崩溃自动恢复" "failure actions 拉起新 PID" "旧=$oldPid 新=$newPid (约$($i*5)s)" "PASS"
  } else {
    Record "崩溃自动恢复" "新 PID 拉起" "90s 内未恢复（检查 sc failure 是否生效）" "FAIL"
  }
}

# ── Phase 6: 汇总 ──
Log "`n==============================================" "Cyan"
Log " 验证汇总" "Cyan"
Log "==============================================" "Cyan"
$Results | Format-Table -AutoSize | Out-String | Write-Host
$passN = ($Results | Where-Object { $_.Verdict -eq "PASS" }).Count
$failN = ($Results | Where-Object { $_.Verdict -eq "FAIL" }).Count
$warnN = ($Results | Where-Object { $_.Verdict -eq "WARN" }).Count
$summaryColor = if ($failN -gt 0) {"Red"} elseif ($warnN -gt 0){"Yellow"} else {"Green"}
Log ("结果: PASS={0}  FAIL={1}  WARN={2}" -f $passN, $failN, $warnN) $summaryColor

if ($failN -gt 0) {
  Log "`n[!] 存在 FAIL 项。检查点：" "Red"
  Log "  - 服务未注册：确认 Phase 1 卸载成功（NOT Installed 才触发 CA）。看安装日志搜 'InstallTriLCService' 'Return value 3'。" "Gray"
  Log "  - 端口未监听：看服务是否真在 RUN（sc query），node 是否崩溃（事件查看器 Application log 找 node.exe 错误）。" "Gray"
  Log "  - 进程非 SYSTEM：WiX CA Impersonate=no 才对；检查 msi 是否被组策略降权。" "Gray"
}

Log "`n详细日志: $LogFile" "Cyan"
Log "MSI 安装日志: $inlog" "DarkGray"

Log "`n=== 回滚（清理服务）===" "Cyan"
Log "  方案A 推荐：msiexec /x `"$MSI`" /qn   （卸载会触发 UninstallTriLCService CA 自动 sc delete）" "Gray"
Log "  方案B 手动：sc stop $ServiceName; sc delete $ServiceName" "Gray"

Log "`n按回车退出..." "Cyan"
Read-Host
