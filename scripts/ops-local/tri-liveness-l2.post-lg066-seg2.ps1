# TriLiveness L2 remote patrol - SSH sweep of R-HY + M-SG (LG-064)
# Judge per CTO plan 0cdc55ae sec 1.2 + amendment verdict A (2026-10-05):
#  - R-HY has no notify endpoint (404 verified): R-HY L1 writes state file,
#    this L2 relays ALERT-NEEDED lines + independently checks hard dims.
#  - SSH unreachable alert text MUST say cause undetermined (may be local
#    offline) - never claim the remote host is down. Mis-verdict ban.
#  - statefile-stale likewise: stale != host down (disk face possible).
# Debounce = 2 consecutive rounds; alert via 18710 tunnel -> sg 8712 notify.
#
# === POST-LG066-SEG2 VARIANT (staged pre-commit, FSD 2026-10-08) ===
# Deploys during LG-066 seg2 window (2026-10-09 17:50-21:00, atomic with the
# trirmc unit cutover 8712->8710). Do NOT deploy before seg2 unit change.
# Staged at: TriMetaverse/scripts/ops-local/tri-liveness-l2.post-lg066-seg2.ps1
# Deploy   : copy this file over %LOCALAPPDATA%\tri-liveness-l2.ps1
#            (scheduled task spawns a fresh process per round - file swap
#            needs no restart; next round picks it up)
# Diff vs pre-merge (all inside R-HY segment; M-SG segment byte-identical):
#   1. $rhCmd: unit sweep trirmc+trirmc-mc -> trirmc only (trirmc-mc stopped/
#      disabled in seg1); port sweep 8712+8710 -> 8710 only (trirmc now ON 8710).
#   2. hz8710 verdict block: promoted to full-body form (ok + cron.enabled +
#      cron.degraded assertions) with unit label trirmc-8710; former
#      "by-design never alert" note retired (post-merge unit IS the cron face).
#   3. hz8712 verdict block: removed (port vacated by seg2; loop echoes
#      empty value, regex needs 1+ chars, so no false issue raised).
#   4. M-SG segment: UNTOUCHED. Plan-doc #3 wrongly located "is-active trimc"
#      (L92) as a stale R-HY name - FALSE: trimc here is the sg unit proper
#      name (l2 itself reads sg token via trimc at L26/L38). Do not rename.
#      (FSD 2026-10-08 finding, reported to COO+CTO.)
param(
  [switch]$DryRun
)
$ErrorActionPreference = 'SilentlyContinue'
$dir   = "$env:LOCALAPPDATA\tri-liveness"
$log   = "$dir\l2.log"
$cntF  = "$dir\l2-failcount"
$pendF = "$dir\l2-pending.txt"
New-Item -ItemType Directory -Path $dir -Force | Out-Null
$nowIso = (Get-Date).ToUniversalTime().ToString('o')
$issues = New-Object System.Collections.Generic.List[string]

# -- pending alert resend --
if (Test-Path $pendF) {
  $pl = Get-Content $pendF
  if ($pl.Count -ge 2) {
    $pt = $pl[0]; $pb = ($pl | Select-Object -Skip 1) -join ' '
    $tok = ssh -n -T -o BatchMode=yes -o ConnectTimeout=8 M-SG-47.245.122.61 'tr ''\0'' ''\n'' </proc/$(systemctl show -p MainPID --value trimc)/environ | grep ^TRIMC_INTERNAL_TOKEN= | cut -d= -f2-' 2>$null
    if ($tok) {
      $payload = @{ source_seat='m-duty-cos'; target_daemon='trimmc'; target_seat='m-duty-cos'; urgent='urgent'; title=$pt; body=$pb } | ConvertTo-Json -Compress
      try {
        $r = Invoke-WebRequest -Uri 'http://127.0.0.1:18710/internal/v1/notify' -Method POST -Headers @{ 'X-Internal-Token'=$tok } -ContentType 'application/json' -Body $payload -TimeoutSec 10 -UseBasicParsing
        if ($r.StatusCode -eq 200) { Remove-Item $pendF -Force; "$nowIso PENDING-RESENT ok: $pt" | Add-Content $log }
      } catch { "$nowIso PENDING-RESEND fail (kept): $pt" | Add-Content $log }
    }
  }
}

function Get-Token {
  ssh -n -T -o BatchMode=yes -o ConnectTimeout=8 M-SG-47.245.122.61 'tr ''\0'' ''\n'' </proc/$(systemctl show -p MainPID --value trimc)/environ | grep ^TRIMC_INTERNAL_TOKEN= | cut -d= -f2-' 2>$null
}
function Send-Alert($title, $body) {
  $tok = Get-Token
  if (-not $tok) { Set-Content -Path $pendF -Value "$title`r`n$body"; "$nowIso ALERT-DEFERRED (ssh-token-fail): $title" | Add-Content $log; return $false }
  $payload = @{ source_seat='m-duty-cos'; target_daemon='trimmc'; target_seat='m-duty-cos'; urgent='urgent'; title=$title; body=$body } | ConvertTo-Json -Compress
  try {
    $r = Invoke-WebRequest -Uri 'http://127.0.0.1:18710/internal/v1/notify' -Method POST -Headers @{ 'X-Internal-Token'=$tok } -ContentType 'application/json' -Body $payload -TimeoutSec 10 -UseBasicParsing
    "$nowIso ALERT-SENT $($r.StatusCode): $title | $body" | Add-Content $log
    return $true
  } catch {
    Set-Content -Path $pendF -Value "$title`r`n$body"
    "$nowIso ALERT-DEFERRED (post-fail): $title" | Add-Content $log
    return $false
  }
}

# ============ R-HY segment (POST-SEG2: single unit trirmc, single port 8710) ============
$rhCmd = 'for u in trirmc; do echo "unit=$u active=$(systemctl is-active $u 2>&1) enabled=$(systemctl is-enabled $u 2>&1)"; done; for p in 8710; do echo "hz$p=$(curl -s --max-time 4 http://127.0.0.1:$p/healthz | head -c 200)"; done; if find /var/lib/trirmc/cron/logs -type f -newermt ''-90 minutes'' 2>/dev/null | head -1 | grep -q .; then echo "LOGSFRESH=yes"; else echo "LOGSFRESH=no"; fi; SF=$(ls -t /var/lib/tri-liveness/state-*.log 2>/dev/null | head -1); if [ -n "$SF" ]; then echo "STATEAGE=$(( ($(date +%s) - $(stat -c %Y $SF)) / 60 ))"; tail -3 $SF; else echo "STATE=absent"; fi'
$rh = ssh -n -T -o BatchMode=yes -o ConnectTimeout=10 R-HY-8.155.54.79 $rhCmd 2>$null
if (-not $rh -or ($rh -is [string] -and $rh.Trim() -eq '')) {
  $issues.Add("dim=ssh host=R-HY state=unreachable note=cause-undetermined-local-offline-possible")
} else {
  foreach ($line in $rh) {
    $l = "$line"
    if ($l -match '^unit=(\S+) active=(\S+) enabled=(\S+)') {
      if ($Matches[2] -ne 'active') { $issues.Add("dim=process host=R-HY unit=$($Matches[1]) state=$($Matches[2])") }
      if ($Matches[3] -ne 'enabled') { $issues.Add("dim=disabled host=R-HY unit=$($Matches[1]) state=$($Matches[3])") }
    } elseif ($l -match '^hz8710=(.+)$') {
      $hzr = $null
      try { $hzr = $Matches[1] | ConvertFrom-Json } catch {}
      if (-not $hzr -or -not $hzr.ok) { $issues.Add("dim=process host=R-HY unit=trirmc-8710 state=healthz-unreachable") }
      elseif ($hzr.cron) {
        if (-not $hzr.cron.enabled) { $issues.Add("dim=heartbeat host=R-HY unit=trirmc-8710 state=cron-disabled") }
        elseif ($hzr.cron.degraded) { $issues.Add("dim=heartbeat host=R-HY unit=trirmc-8710 state=degraded consecutiveFailures=$($hzr.cron.consecutiveFailures)") }
      }
    } elseif ($l -match '^LOGSFRESH=no$') {
      $issues.Add("dim=heartbeat host=R-HY unit=cron-logs state=no-fresh-log-90min")
    } elseif ($l -match '^STATEAGE=(\d+)$') {
      if ([int]$Matches[1] -gt 15) { $issues.Add("dim=statefile host=R-HY state=stale ageMin=$($Matches[1]) note=cause-undetermined") }
    } elseif ($l -match '^STATE=absent$') {
      $issues.Add("dim=statefile host=R-HY state=absent")
    } elseif ($l -match 'ALERT-NEEDED') {
      $issues.Add("dim=relay host=R-HY src=l1-statefile state=ALERT-NEEDED detail=$l")
    }
  }
}

# ============ M-SG segment (UNTOUCHED - do not rename trimc: sg proper name, see header #4) ============
$msgCmd = 'echo "unit=trimc active=$(systemctl is-active trimc 2>&1) enabled=$(systemctl is-enabled trimc 2>&1)"; echo "hz8712=$(curl -s --max-time 4 http://127.0.0.1:8712/healthz | head -c 200)"; python3 /usr/local/sbin/tri-heartbeat-check.py 2>&1'
$msg = ssh -n -T -o BatchMode=yes -o ConnectTimeout=10 M-SG-47.245.122.61 $msgCmd 2>$null
if (-not $msg -or ($msg -is [string] -and $msg.Trim() -eq '')) {
  $issues.Add("dim=ssh host=M-SG state=unreachable note=cause-undetermined-local-offline-possible")
} else {
  foreach ($line in $msg) {
    $l = "$line"
    if ($l -match '^unit=trimc active=(\S+) enabled=(\S+)') {
      if ($Matches[1] -ne 'active') { $issues.Add("dim=process host=M-SG unit=trimc state=$($Matches[1])") }
      if ($Matches[2] -ne 'enabled') { $issues.Add("dim=disabled host=M-SG unit=trimc state=$($Matches[2])") }
    } elseif ($l -match '^hz8712=(.+)$') {
      $hzr = $null
      try { $hzr = $Matches[1] | ConvertFrom-Json } catch {}
      if (-not $hzr -or -not $hzr.ok) { $issues.Add("dim=process host=M-SG unit=trimc-8712 state=healthz-unreachable") }
      elseif ($hzr.cron) {
        if (-not $hzr.cron.enabled) { $issues.Add("dim=heartbeat host=M-SG unit=trimc-8712 state=cron-disabled") }
        elseif ($hzr.cron.degraded) { $issues.Add("dim=heartbeat host=M-SG unit=trimc-8712 state=degraded consecutiveFailures=$($hzr.cron.consecutiveFailures)") }
      }
    } elseif ($l -match '^STALE ') {
      $issues.Add("dim=heartbeat host=M-SG $($l.Trim())")
    }
    # HEARTBEAT-OK lines: no-op
  }
}

# dedup: statefile relay lines can repeat within one round (LG-064 maintenance wave)
if ($issues.Count -gt 1) {
  $uniq = [System.Collections.Generic.List[string]]::new()
  foreach ($i in $issues) { if (-not $uniq.Contains($i)) { $uniq.Add($i) } }
  $issues = $uniq
}

# ============ verdict + debounce + alert ============
if ($issues.Count -eq 0) {
  if (Test-Path $cntF) { Remove-Item $cntF -Force; "$nowIso recovered; fail counter reset" | Add-Content $log }
  "$nowIso OK all-hosts" | Add-Content $log
  exit 0
}
$n = 0
if (Test-Path $cntF) { $n = [int](Get-Content $cntF -Raw) }
$n = $n + 1
if ($n -lt 2) {
  Set-Content -Path $cntF -Value $n
  "$nowIso ISSUES x$n (debounce $n/2): $($issues -join '; ')" | Add-Content $log
  exit 0
}
Remove-Item $cntF -Force -ErrorAction SilentlyContinue
$title = "[L2/dev-win] remote liveness issues x$($issues.Count)"
$body = "src=l2-host-dev ts=$nowIso; " + ($issues -join '; ')
if ($DryRun) { "$nowIso DRYRUN-ALERT: $title | $body" | Add-Content $log; exit 0 }
Send-Alert $title $body | Out-Null
