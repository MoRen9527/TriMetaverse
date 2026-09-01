# verify-trilc-24h.ps1
# TriRLC Daemon 24h stability verification (w32-2)
#
# Usage (Admin PowerShell):
#   .\verify-trilc-24h.ps1                     # Full 24h
#   .\verify-trilc-24h.ps1 -DurationHours 1    # Quick 1h test
#   .\verify-trilc-24h.ps1 -DurationHours 1 -SampleIntervalMinutes 5

param(
    [int]$DurationHours = 24,
    [int]$SampleIntervalMinutes = 30,
    [int]$Port = 8711
)

$ErrorActionPreference = "Continue"
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$LogFile = "$env:TEMP\trilc-24h-$Stamp.log"
$ReportFile = "$env:TEMP\trilc-24h-$Stamp.json"
$HealthzUrl = "http://127.0.0.1:$Port/healthz"

New-Item -ItemType Directory -Force -Path "$env:TEMP\trilc-cron-test" | Out-Null

$Samples = [System.Collections.ArrayList]::new()
$StartTime = Get-Date
$SampleCount = [math]::Ceiling(($DurationHours * 60) / $SampleIntervalMinutes)
$ErrorCount = 0

function Write-Log {
    param([string]$Msg)
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $Msg"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line -Encoding UTF8
}

Write-Log "============================================"
Write-Log " TriRLC Daemon Stability Verification (w32-2)"
Write-Log "============================================"
Write-Log " Port:      $Port"
Write-Log " Duration:  $DurationHours h"
Write-Log " Interval:  $SampleIntervalMinutes min"
Write-Log " Samples:   $SampleCount"
Write-Log " Log:       $LogFile"
Write-Log " Report:    $ReportFile"

# ── Phase 1: Baseline ──
Write-Log ""
Write-Log "[Phase 1] Baseline"

try {
    $r = Invoke-RestMethod -Uri $HealthzUrl -TimeoutSec 5 -ErrorAction Stop
    $uptimeH = [math]::Round($r.uptime / 3600, 1)
    Write-Log "  ok:          $($r.ok)"
    Write-Log "  service:     $($r.service)"
    Write-Log "  version:     $($r.version)"
    Write-Log "  uptime:      $($r.uptime)s ($uptimeH h)"
    Write-Log "  trimc:       $($r.trimc)"
    Write-Log "  activeTasks: $($r.activeTasks)"
    Write-Log "  queueSize:   $($r.queueSize)"
    Write-Log "  heartbeat:   enabled=$($r.heartbeat.enabled) agents=$($r.heartbeat.agentCount)"
    Write-Log "  cron:        enabled=$($r.cron.enabled) jobs=$($r.cron.jobCount) degraded=$($r.cron.degraded)"
    Write-Log "  reaper:      enabled=$($r.sessionReaper.enabled)"

    $entry = @{
        time = (Get-Date -Format 'o')
        up = $r.uptime
        tasks = $r.activeTasks
        queue = $r.queueSize
        trimc = $r.trimc
        cronJobs = $r.cron.jobCount
        cronDegraded = $r.cron.degraded
        hb = $r.heartbeat.enabled
        reaper = $r.sessionReaper.enabled
        ok = $r.ok
    }
    $Samples.Add($entry) | Out-Null
} catch {
    Write-Log "  FATAL: /healthz unreachable. Is daemon running? trilc start"
    exit 1
}

# ── Phase 2: Cron smoke test ──
Write-Log ""
Write-Log "[Phase 2] Cron smoke test"

$cronJobId = "w32-2-ping"
$cronLogDir = "$env:TEMP\trilc-cron-test"

try {
    $addResult = & trilc cron add $cronJobId --schedule "0 * * * *" `
        --command "powershell -Command Add-Content -Path '$cronLogDir\ping.log' -Value (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" `
        --description "w32-2 cron ping" 2>&1
    Write-Log "  cron add: $addResult"

    Start-Sleep -Seconds 2
    $runResult = & trilc cron run $cronJobId 2>&1
    Write-Log "  cron run: $runResult"

    Start-Sleep -Seconds 3
    if (Test-Path "$cronLogDir\ping.log") {
        $lastLine = Get-Content "$cronLogDir\ping.log" -Tail 1
        Write-Log "  ping log: $lastLine"
    } else {
        Write-Log "  ping log: (not yet written, may have delay)"
    }
} catch {
    Write-Log "  WARN: cron test exception: $_"
}

# ── Phase 3: Session Reaper check ──
Write-Log ""
Write-Log "[Phase 3] Session Reaper"
$r2 = Invoke-RestMethod -Uri $HealthzUrl -TimeoutSec 5
Write-Log "  enabled: $($r2.sessionReaper.enabled)"

# ── Phase 4: Monitoring loop ──
Write-Log ""
Write-Log "[Phase 4] Monitoring loop ($DurationHours h)"

$iterations = 0
for ($i = 1; $i -le $SampleCount; $i++) {
    $waitSec = $SampleIntervalMinutes * 60
    Write-Log "  waiting ${SampleIntervalMinutes}min ($i/$SampleCount)..."
    Start-Sleep -Seconds $waitSec

    $iterations++
    try {
        $r = Invoke-RestMethod -Uri $HealthzUrl -TimeoutSec 5 -ErrorAction Stop
        $upH = [math]::Round($r.uptime / 3600, 1)
        $elapsed = [math]::Round(((Get-Date) - $StartTime).TotalHours, 1)

        $status = "OK"
        if ($r.cron.degraded) { $status = "DEGRADED"; $ErrorCount++ }
        if (-not $r.ok) { $status = "FAIL"; $ErrorCount++ }

        Write-Log ("  [{0,3}/{1}] up={2}s ({3}h) tasks={4} cronJobs={5} cronFail={6} trimc={7} [{8}]" -f `
            $i, $SampleCount, $r.uptime, $upH, $r.activeTasks, $r.cron.jobCount, `
            $r.cron.consecutiveFailures, $r.trimc, $status)

        $entry = @{
            time = (Get-Date -Format 'o')
            n = $i
            up = $r.uptime
            upH = $upH
            tasks = $r.activeTasks
            queue = $r.queueSize
            trimc = $r.trimc
            cronJobs = $r.cron.jobCount
            cronFail = $r.cron.consecutiveFailures
            ok = $r.ok
        }
        $Samples.Add($entry) | Out-Null

    } catch {
        Write-Log "  ERROR sample $i : $_"
        $ErrorCount++
        $Samples.Add(@{ time = (Get-Date -Format 'o'); n = $i; error = $_.Exception.Message }) | Out-Null
    }
}

# ── Phase 5: Report ──
Write-Log ""
Write-Log "[Phase 5] Report"

$EndTime = Get-Date
$totalH = [math]::Round(($EndTime - $StartTime).TotalHours, 1)

$verdict = if ($ErrorCount -eq 0) { "PASS" } elseif ($ErrorCount -le 2) { "CONDITIONAL_PASS" } else { "FAIL" }

$report = [ordered]@{
    testId = "w32-2-$Stamp"
    start = $StartTime.ToString('o')
    end = $EndTime.ToString('o')
    durationHours = $totalH
    samples = $iterations
    errors = $ErrorCount
    verdict = $verdict
    samples_detail = $Samples
}

$report | ConvertTo-Json -Depth 4 -Compress | Out-File $ReportFile -Encoding UTF8

Write-Log ""
Write-Log "============================================"
Write-Log " Verification Complete"
Write-Log "============================================"
Write-Log " Duration: $totalH h"
Write-Log " Samples:  $iterations / $SampleCount"
Write-Log " Errors:   $ErrorCount"
Write-Log " Verdict:  $verdict"
Write-Log " Report:   $ReportFile"
Write-Log " Log:      $LogFile"

# Cleanup cron job
try {
    & trilc cron remove $cronJobId 2>&1 | Out-Null
    Write-Log " Cron job '$cronJobId' cleaned up"
} catch {
    Write-Log " Cron cleanup: run manually: trilc cron remove $cronJobId"
}

Write-Log ""
Read-Host "Press Enter to exit"
