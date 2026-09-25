# trimodel-l2-stub.ps1 — L2 恢复梯调用桩（TASK-TRIMODEL-RECOVERY-LADDER-01 波②）
# 契约（拆派单波②L2）：标记扫描＋探活判定＋结构化日志行 fail-closed——**不写真活体**；
# restore-direct 本体=波③共享 core 交付物，落地后本桩换接线真调用。
# 标记契约：.fade/trimodel-l2-flag（JSON {reason,ts,detail}；写入方=L1 watchdog；清理方=本脚本在
# 双层探活全绿时清理=误报自愈；restore 真调用成功后的清理归波③接线版）。
# 日志：.fade/trimodel-l2-stub.log，结构化行 L2STUB | <iso-ts> | <字段族>。
$ErrorActionPreference = 'SilentlyContinue'
$l2Flag = 'D:\Code\ai\TriMetaverse\.fade\trimodel-l2-flag'
$log = 'D:\Code\ai\TriMetaverse\.fade\trimodel-l2-stub.log'
$envFile = 'D:\Code\ai\TriModel\.env'
$ts = Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz'

if (-not (Test-Path $l2Flag)) { return }   # 无标记=无事发生，不刷日志

$flag = $null
try { $flag = Get-Content $l2Flag -Raw | ConvertFrom-Json } catch { }
$reason = if ($flag) { $flag.reason } else { 'unreadable-flag' }

function Read-ApiToken {
  try {
    foreach ($line in Get-Content -Path $envFile) {
      if ($line -match '^TRIMODEL_API_TOKEN=(.*)$') { return $Matches[1].Trim() }
    }
  } catch { }
  return ''
}

# 双层自探活（与 L1 watchdog 判定同款；健康=清标记自愈）
$healthUp = $false
try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:3333/health' -TimeoutSec 8 -UseBasicParsing; if ($r.StatusCode -eq 200) { $healthUp = $true } } catch { }
$bizAlive = $false
if ($healthUp) {
  $tok = Read-ApiToken
  if ($tok) {
    try {
      $r2 = Invoke-WebRequest -Uri 'http://127.0.0.1:3333/v1/config/keys' -Headers @{ Authorization = "Bearer $tok" } -TimeoutSec 8 -UseBasicParsing
      if ($r2.StatusCode -eq 200) {
        $body = $r2.Content | ConvertFrom-Json
        $vals = @($body.PSObject.Properties | Where-Object { $_.Value -and [string]$_.Value -ne '' })
        if ($vals.Count -gt 0) { $bizAlive = $true }
      }
    } catch { }
  }
}

if ($healthUp -and $bizAlive) {
  # 误报自愈：服务已恢复双层全绿 → 清标记
  Remove-Item -Path $l2Flag -Force
  Add-Content -Path $log -Value "L2STUB | $ts | action=clear-flag | verdict=healthy | reason=$reason | note=liveness-recovered-flag-cleared"
  return
}

# 服务仍异常 → fail-closed：桩不写真活体，结构化日志行留痕候波③接线
$restoreScript = 'D:\Code\ai\TriCompany\scripts\ops\local\restore-claude-direct.ps1'
$restoreReady = Test-Path $restoreScript
Add-Content -Path $log -Value "L2STUB | $ts | action=restore-pending | verdict=unhealthy health=$healthUp biz=$bizAlive | reason=$reason | core=wave3-pending | restore_script_present=$restoreReady | note=fail-closed-no-live-write; core lands in wave3 then rewire"
