# trimodel-l2-stub.ps1 — L2 恢复梯真调用（TASK-TRIMODEL-RECOVERY-LADDER-01 波③⑦ 接线版）
# 契约（拆派单波③⑦ + CTO model 父命令制条款）：标记扫描＋探活判定＋真调用
#   trimlc model restore-direct --provider bigmodel（命令串全文）——经 TriCode core runCli
#   五门内核（备份先行/键名锁定/健康门 fail-closed/diff 回读断言/掩码审计）写真活体
#   ~/.claude/settings.json。写目标可由 TRIMODEL_CLAUDE_SETTINGS 环境钉位（core 契约原生透传，
#   沙箱演练/测试用；运行时未钉位=真活体，此即 L2 梯存在语义）。
# 标记契约：.fade/trimodel-l2-flag（JSON {reason,ts,detail}；写入方=L1 watchdog；清理方=本脚本：
#   双层探活全绿=误报自愈清理；restore 真调用 exit 0=恢复成功清理；失败保留标记下次重试）。
# 日志：.fade/trimodel-l2-stub.log，结构化行 L2STUB | <iso-ts> | <字段族>。
$ErrorActionPreference = 'SilentlyContinue'
$l2Flag = 'D:\Code\ai\TriMetaverse\.fade\trimodel-l2-flag'
$log = 'D:\Code\ai\TriMetaverse\.fade\trimodel-l2-stub.log'
$envFile = 'D:\Code\ai\TriModel\.env'
$trimlcCli = 'D:\Code\ai\TriMLC\dist\cli.js'   # trimlc bin 本体（npm bin trimlc 所指 dist/cli.js）
$cmdText = 'trimlc model restore-direct --provider bigmodel'   # CTO 条款：接线命令串全文
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
  Add-Content -Path $log -Encoding UTF8 -Value "L2STUB | $ts | action=clear-flag | verdict=healthy | reason=$reason | note=liveness-recovered-flag-cleared"
  return
}

# 服务仍异常 → L2 真恢复：trimlc model restore-direct（core 五门承载；deploy-key 走 core
# 缺省链 env→per-provider→legacy；健康门/回滚断言全由 core fail-closed）
if (-not (Test-Path $trimlcCli)) {
  Add-Content -Path $log -Encoding UTF8 -Value "L2STUB | $ts | action=restore-blocked | verdict=cli-missing | path=$trimlcCli | reason=$reason | note=fail-closed-flag-kept"
  return
}
$restore = cmd /c "node `"$trimlcCli`" model restore-direct --provider bigmodel 2>&1"
$exit = $LASTEXITCODE
$out = ($restore | Out-String).Trim()
$outLine = (($out -replace "`r", '') -replace "`n", ' / ')
if ($outLine.Length -gt 240) { $outLine = $outLine.Substring(0, 240) + '…' }   # 护栏截断（core 输出已掩码，双保险）
Add-Content -Path $log -Encoding UTF8 -Value "L2STUB | $ts | action=restore-output | detail=$outLine"
if ($exit -eq 0) {
  # 恢复成功 → 清标记（波③⑦ 起由本脚本负责；下一轮探活双绿亦会自愈兜底）
  Remove-Item -Path $l2Flag -Force
  Add-Content -Path $log -Encoding UTF8 -Value "L2STUB | $ts | action=restore-done | cmd=$cmdText | exit=0 | reason=$reason | note=flag-cleared-after-restore"
} else {
  # fail-closed：保留标记，下次调度重试（core 健康门/钥缺失等拒绝均落此臂）
  Add-Content -Path $log -Encoding UTF8 -Value "L2STUB | $ts | action=restore-failed | cmd=$cmdText | exit=$exit | reason=$reason | note=fail-closed-flag-kept-retry-next-run"
}
