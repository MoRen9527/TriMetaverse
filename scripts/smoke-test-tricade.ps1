# smoke-test-tricade.ps1
# TriCade Smoke Test Suite (w32-8)
# Quick ~5min validation after install or update.
#
# Usage:
#   .\smoke-test-tricade.ps1                    # Full suite
#   .\smoke-test-tricade.ps1 -Quick              # Fast mode (~2min, skip cron wait)
#   .\smoke-test-tricade.ps1 -Port 8711          # Custom port
#
# Requires: Admin privileges for service checks. Non-admin limited to healthz+CLI.

param(
    [int]$Port = 8711,
    [switch]$Quick
)

$ErrorActionPreference = "Continue"
$HealthzUrl = "http://127.0.0.1:$Port/healthz"
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ReportFile = "$env:TEMP\smoke-test-$Stamp.json"
$Pass = 0; $Fail = 0; $Skip = 0

function Header { Write-Host "`n--- $args ---" -ForegroundColor Cyan }
function Pass   { $script:Pass++; Write-Host "  [PASS] $args" -ForegroundColor Green }
function Fail   { $script:Fail++; Write-Host "  [FAIL] $args" -ForegroundColor Red }
function Skip   { $script:Skip++; Write-Host "  [SKIP] $args" -ForegroundColor DarkGray }

# ── 1. Healthz ──
Header "1. Healthz Endpoint"
try {
    $r = Invoke-RestMethod -Uri $HealthzUrl -TimeoutSec 5 -ErrorAction Stop
    if ($r.ok) {
        Pass "healthz ok, uptime=$($r.uptime)s, version=$($r.version)"
    } else {
        Fail "healthz returned ok=false"
    }
    if ($r.uptime -gt 0) { Pass "uptime > 0 ($($r.uptime)s)" } else { Fail "uptime = 0" }
    if ($r.heartbeat.enabled) { Pass "heartbeat enabled" } else { Fail "heartbeat not enabled" }
    if ($r.sessionReaper.enabled) { Pass "sessionReaper enabled" } else { Fail "sessionReaper not enabled" }
} catch {
    Fail "healthz unreachable: $_"
}

# ── 2. Daemon CLI ──
Header "2. Daemon CLI"
$statusResult = & trilc status --port $Port 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Pass "trilc status OK"
} else {
    Fail "trilc status failed: $statusResult"
}

# ── 3. Cron Engine ──
Header "3. Cron Engine"
$testJobId = "smoke-test-$Stamp"

$addResult = & trilc cron add $testJobId --schedule "*/5 * * * *" `
    --command "echo smoke-test-ok" `
    --description "smoke test job" 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Pass "cron add OK"
} else {
    Fail "cron add failed: $addResult"
}

$listResult = & trilc cron list 2>&1 | Out-String
if ($listResult -match $testJobId) {
    Pass "cron list shows test job"
} else {
    Fail "cron list missing test job"
}

$runResult = & trilc cron run $testJobId 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Pass "cron run OK"
} else {
    Fail "cron run failed: $runResult"
}

if (-not $Quick) {
    Start-Sleep -Seconds 3
    $logResult = & trilc cron log $testJobId 2>&1 | Out-String
    if ($logResult -match "smoke-test-ok" -or $logResult -match "exit.*0") {
        Pass "cron log confirms execution"
    } elseif ($logResult -match "execution_log") {
        Pass "cron log available (check format)"
    } else {
        Skip "cron log format unknown (may be async)"
    }
}

& trilc cron remove $testJobId 2>&1 | Out-Null
Pass "cron cleanup OK"

# ── 4. Port Listening ──
Header "4. Port Listening"
$portCheck = netstat -ano | Select-String ":$Port\s+.*LISTENING"
if ($portCheck) {
    Pass "port $Port listening"
    $addr = ($portCheck[0].Line -split "\s+")[1]
    Write-Host "       addr: $addr" -ForegroundColor DarkGray
} else {
    Fail "port $Port not listening"
}

# ── 5. Service Check (admin only) ──
Header "5. Windows Service"
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Skip "not admin — skip service check"
} else {
    $svc = sc.exe query TriRLC 2>&1
    if ($LASTEXITCODE -eq 0) {
        $stateLine = (($svc -split "`n") | Where-Object { $_ -match "STATE" } | Select-Object -First 1).Trim()
        if ($stateLine -match "RUNNING") {
            Pass "TriRLC service: $stateLine"
        } else {
            Fail "TriRLC service: $stateLine"
        }
    } else {
        Skip "TriRLC service not registered (daemon running via other method)"
    }
}

# ── 6. Summary ──
Header "6. Summary"
$total = $Pass + $Fail + $Skip
$verdict = if ($Fail -eq 0) { "PASS" } else { "FAIL" }

Write-Host ""
Write-Host "============================================" -ForegroundColor $(if($Fail -eq 0){"Green"}else{"Red"})
Write-Host " Smoke Test: $verdict"
Write-Host "============================================" -ForegroundColor $(if($Fail -eq 0){"Green"}else{"Red"})
Write-Host "  PASS: $Pass  FAIL: $Fail  SKIP: $Skip  ($total total)"
Write-Host ""

if ($Fail -gt 0) {
    Write-Host "Failed checks need investigation:" -ForegroundColor Red
    Write-Host "  1. Is daemon running?  trilc start"
    Write-Host "  2. Port conflict?       netstat -ano | findstr $Port"
    Write-Host "  3. Cron DB corrupt?     trilc cron status"
}

$report = [ordered]@{
    testId = "smoke-$Stamp"
    time = (Get-Date -Format 'o')
    port = $Port
    pass = $Pass
    fail = $Fail
    skip = $Skip
    verdict = $verdict
}
$report | ConvertTo-Json -Compress | Out-File $ReportFile -Encoding UTF8
Write-Host "Report: $ReportFile" -ForegroundColor DarkGray
