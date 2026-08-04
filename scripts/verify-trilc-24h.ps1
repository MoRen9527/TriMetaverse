# verify-trilc-24h.ps1
# TriLC Daemon 24h 稳定性验证脚本 (w32-2)
#
# 用法（管理员 PowerShell）：
#   .\verify-trilc-24h.ps1                     # 24h 监控（每小时采样）
#   .\verify-trilc-24h.ps1 -DurationHours 1    # 1h 快速验证
#   .\verify-trilc-24h.ps1 -DurationHours 4    # 4h 中等验证
#   .\verify-trilc-24h.ps1 -SkipCron           # 跳过 cron 测试
#
# 产出：$env:TEMP\trilc-24h-<timestamp>.log + .json 报告

param(
    [int]$DurationHours = 24,
    [int]$SampleIntervalMinutes = 30,
    [int]$Port = 8711,
    [switch]$SkipCron,
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$LogFile = "$env:TEMP\trilc-24h-$Stamp.log"
$ReportFile = "$env:TEMP\trilc-24h-$Stamp.json"
$CronJobId = "w32-2-healthcheck-ping"
$CronLogDir = "$env:TEMP\trilc-cron-test"
$HealthzUrl = "http://127.0.0.1:$Port/healthz"

# ── 初始化 ──
New-Item -ItemType Directory -Force -Path $CronLogDir | Out-Null
$Samples = [System.Collections.ArrayList]::new()
$StartTime = Get-Date
$SampleCount = [math]::Ceiling(($DurationHours * 60) / $SampleIntervalMinutes)

function Log {
    param([string]$Msg, [string]$Level = "INFO")
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') [$Level] $Msg"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line -Encoding UTF8
}

Log "============================================"
Log " TriLC Daemon 24h 稳定性验证"
Log "============================================"
Log " 端口: $Port"
Log " 时长: $DurationHours h"
Log " 采样间隔: $SampleIntervalMinutes min"
Log " 预计采样次数: $SampleCount"
Log " 日志: $LogFile"
Log " 报告: $ReportFile"

# ── Phase 1: 基线采集 ──
Log "`n[Phase 1] 基线采集"

try {
    $baseline = Invoke-RestMethod -Uri $HealthzUrl -TimeoutSec 5 -ErrorAction Stop
    Log "  /healthz: ok=$($baseline.ok) service=$($baseline.service) version=$($baseline.version)"
    Log "  uptime: $($baseline.uptime)s ($([math]::Round($baseline.uptime/3600,1))h)"
    Log "  heartbeat: enabled=$($baseline.heartbeat.enabled) agents=$($baseline.heartbeat.agentCount)"
    Log "  cron: enabled=$($baseline.cron.enabled) jobs=$($baseline.cron.jobCount) degraded=$($baseline.cron.degraded)"
    Log "  sessionReaper: enabled=$($baseline.sessionReaper.enabled)"

    $baselineSample = @{
        timestamp = (Get-Date -Format 'o')
        uptime = $baseline.uptime
        activeTasks = $baseline.activeTasks
        queueSize = $baseline.queueSize
        trimc = $baseline.trimc
        cronJobCount = $baseline.cron.jobCount
        cronDegraded = $baseline.cron.degraded
        heartbeatEnabled = $baseline.heartbeat.enabled
        sessionReaperEnabled = $baseline.sessionReaper.enabled
    }
    $Samples.Add($baselineSample) | Out-Null
} catch {
    Log "  [X] /healthz 基线采集失败: $_" "ERROR"
    Log "  daemon 未运行。请先执行: trilc start"
    exit 1
}

# ── Phase 2: Cron 功能验证 ──
if (-not $SkipCron) {
    Log "`n[Phase 2] Cron 功能验证"

    # 添加测试 cron job：每 30 分钟写时间戳到文件
    try {
        $cronAdd = & trilc cron add $CronJobId --schedule "*/30 * * * *" `
            --command "powershell -Command \"Add-Content -Path '$CronLogDir\cron-ping.log' -Value \\\"\$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') [ping] w32-2 cron alive\\\" -Encoding UTF8\"" `
            --description "w32-2 24h稳定性验证 - cron ping" 2>&1
        Log "  cron job '$CronJobId' 已添加: $cronAdd"

        # 手动触发一次验证
        Start-Sleep -Seconds 2
        $cronRun = & trilc cron run $CronJobId 2>&1
        Log "  cron 手动触发: $cronRun"

        Start-Sleep -Seconds 3
        if (Test-Path "$CronLogDir\cron-ping.log") {
            $pingContent = Get-Content "$CronLogDir\cron-ping.log" -Tail 1
            Log "  cron ping 日志: $pingContent"
        } else {
            Log "  [!] cron ping 日志未生成（可能有延迟）" "WARN"
        }

        # 查看 cron 状态
        $cronStatus = & trilc cron status 2>&1
        Log "  cron 状态: $cronStatus"
    } catch {
        Log "  [!] cron 测试失败: $_（cron 功能可能未就绪，继续其他验证）" "WARN"
    }
}

# ── Phase 3: Session Reaper 验证 ──
Log "`n[Phase 3] Session Reaper 验证"
try {
    $baseline2 = Invoke-RestMethod -Uri $HealthzUrl -TimeoutSec 5
    Log "  sessionReaper.enabled: $($baseline2.sessionReaper.enabled)"
    if ($baseline2.sessionReaper.enabled) {
        Log "  [OK] Session Reaper 已启用"
    } else {
        Log "  [!] Session Reaper 未启用" "WARN"
    }
} catch {
    Log "  [!] Phase 3 验证失败: $_" "WARN"
}

# ── Phase 4: 持续监控 ──
Log "`n[Phase 4] 持续监控 ($DurationHours h, 每 $SampleIntervalMinutes min 采样)"

$iterations = 0
$errors = 0

for ($i = 1; $i -le $SampleCount; $i++) {
    $waitSeconds = $SampleIntervalMinutes * 60
    if ($Verbose) { Log "  等待 ${SampleIntervalMinutes}min ($i/$SampleCount)..." "DEBUG" }
    Start-Sleep -Seconds $waitSeconds

    $iterations++
    try {
        $sample = Invoke-RestMethod -Uri $HealthzUrl -TimeoutSec 5 -ErrorAction Stop
        $sampleData = @{
            timestamp = (Get-Date -Format 'o')
            iteration = $i
            uptime = $sample.uptime
            uptimeHours = [math]::Round($sample.uptime / 3600, 2)
            activeTasks = $sample.activeTasks
            queueSize = $sample.queueSize
            trimc = $sample.trimc
            cronJobCount = $sample.cron.jobCount
            cronDegraded = $sample.cron.degraded
            cronFailures = $sample.cron.consecutiveFailures
            heartbeatEnabled = $sample.heartbeat.enabled
            sessionReaperEnabled = $sample.sessionReaper.enabled
            ok = $sample.ok
        }
        $Samples.Add($sampleData) | Out-Null

        $elapsed = [math]::Round(((Get-Date) - $StartTime).TotalHours, 1)
        Log ("[{0,4}/{1}] uptime={2,6}s ({3,5}h) tasks={4,2} cronJobs={5,2} cronFail={6} triMC={7}" `
            -f $i, $SampleCount, $sample.uptime, [math]::Round($sample.uptime/3600,1),
               $sample.activeTasks, $sample.cron.jobCount, $sample.cron.consecutiveFailures, $sample.trimc)

        # 检查异常
        if (-not $sample.ok) {
            Log "  [X] /healthz ok=false!" "ERROR"
            $errors++
        }
        if ($sample.cron.degraded) {
            Log "  [!] cron degraded" "WARN"
            $errors++
        }

    } catch {
        Log "  [X] 采样 $i 失败: $_" "ERROR"
        $errors++
        $Samples.Add(@{ timestamp = (Get-Date -Format 'o'); iteration = $i; error = $_.Exception.Message }) | Out-Null
    }
}

# ── Phase 5: 汇总报告 ──
Log "`n[Phase 5] 汇总报告"

$EndTime = Get-Date
$totalHours = [math]::Round(($EndTime - $StartTime).TotalHours, 1)

# 计算统计
$uptimes = $Samples | Where-Object { $_.uptime } | ForEach-Object { $_.uptime }
$allOk = ($Samples | Where-Object { $_.ok -eq $true }).Count
$allErrors = ($Samples | Where-Object { $_.error }).Count

$report = @{
    testId = "w32-2-$Stamp"
    startTime = $StartTime.ToString('o')
    endTime = $EndTime.ToString('o')
    durationHours = $totalHours
    port = $Port
    sampleCount = $iterations
    errorCount = $errors
    baseline = @{
        version = $baseline.version
        uptime = $baseline.uptime
        daemonMode = $baseline.daemon.mode
    }
    samples = $Samples
    verdict = if ($errors -eq 0) { "PASS" } elseif ($errors -le 2) { "CONDITIONAL_PASS" } else { "FAIL" }
    notes = @()
}

# 检查 cron ping 结果
if (-not $SkipCron) {
    if (Test-Path "$CronLogDir\cron-ping.log") {
        $pingLines = Get-Content "$CronLogDir\cron-ping.log"
        $report.cronPingCount = $pingLines.Count
        $report.notes += "cron ping: $($pingLines.Count) records in $CronLogDir\cron-ping.log"
    }
}

$report | ConvertTo-Json -Depth 4 | Out-File $ReportFile -Encoding UTF8

Log "`n============================================"
Log " 验证完成"
Log "============================================"
Log " 时长: $totalHours h"
Log " 采样: $iterations/$SampleCount"
Log " 错误: $errors"
Log " 结论: $($report.verdict)"
Log " 报告: $ReportFile"
Log " 日志: $LogFile"

# 清理 cron job
if (-not $SkipCron) {
    try {
        & trilc cron remove $CronJobId 2>&1 | Out-Null
        Log " cron job '$CronJobId' 已清理"
    } catch {
        Log " cron job 清理失败（手动清理: trilc cron remove $CronJobId）" "WARN"
    }
}

Log "`n按回车退出..."
Read-Host
