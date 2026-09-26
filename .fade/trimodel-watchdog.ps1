# trimodel-watchdog.ps1 v3 — 常驻循环型（v2 单层 /health；v3 双层探针+轮计数+L2 标记+单实例互斥）
# TASK-TRIMODEL-RECOVERY-LADDER-01 波② L1（2026-09-25，joint-plan §问2 判定表）
#
# 判定表（双层探针）：
#   /health 非 200                    = 进程死 → L1 拉起（launch.vbs）→10s 复探；连续 3 轮无效 → L2 标记
#   /health 200 且 keys 业务探针 401/空值 = auth 死态 → 跳过 L1 直接触发 L2 标记（进程活着配置坏，重启无意义）
#   /health 200 且 keys 200 带值      = 健康 → 清轮计数
#
# v3 改造注记（CTO 裁示①实勘留痕）：
#   - 计划任务 TriModel-Watchdog 触发器=PT5M 无限重复（Get-ScheduledTask 实勘 2026-09-25 23:3x，
#     Missed=1010）——Enabled 后每 5 分钟新增一个 wscript→本脚本常驻实例，v2 无互斥=多实例
#     并行实锤 → v3 加命名 Mutex（Global\TrimodelWatchdogSingleton，跨会话），覆盖「计划任务
#     实例」与「手工/其他包装拉起实例」两种来源：抢不到锁=已有实例在跑，立即退出。
#   - 业务探针凭据从 TriModel/.env 读（TRIMODEL_API_TOKEN 键；钥值不进日志）。
#   - L2 标记契约：.fade/trimodel-l2-flag，JSON 一行 {reason, ts, detail}；写入方=本脚本，
#     清理方=L2（restore 成功后）；本脚本不清标记（幂等重写同内容无害）。
#   - 日志留痕沿 v2 现役格式（trimodel-watchdog.log，ISO 时戳+短句）。
param([switch]$SelfTest)
$ErrorActionPreference = 'SilentlyContinue'

$log = 'D:\Code\ai\TriMetaverse\.fade\trimodel-watchdog.log'
$l2Flag = 'D:\Code\ai\TriMetaverse\.fade\trimodel-l2-flag'
$launchVbs = 'D:\Code\ai\TriMetaverse\.fade\trimodel-launch.vbs'
$envFile = 'D:\Code\ai\TriModel\.env'
$maxRounds = 3

function Read-ApiToken {
  # 从 TriModel/.env 提取 TRIMODEL_API_TOKEN 值（钥值不进日志；读不到=空串→业务探针按空值态判定）
  try {
    foreach ($line in Get-Content -Path $envFile) {
      if ($line -match '^TRIMODEL_API_TOKEN=(.*)$') { return $Matches[1].Trim() }
    }
  } catch { }
  return ''
}

function Test-BusinessProbe {
  # 业务探针：/v1/config/keys 带值断言（200 且返回体含非空键=活；401/5xx/空值=auth 死态）
  $tok = Read-ApiToken
  if (-not $tok) { return @{ alive = $false; why = 'no-token-in-env' } }
  try {
    $r = Invoke-WebRequest -Uri 'http://127.0.0.1:3333/v1/config/keys' -Headers @{ Authorization = "Bearer $tok" } -TimeoutSec 8 -UseBasicParsing
    if ($r.StatusCode -ne 200) { return @{ alive = $false; why = "keys-http-$($r.StatusCode)" } }
    $body = $r.Content | ConvertFrom-Json
    $vals = @($body.PSObject.Properties | Where-Object { $_.Value -and [string]$_.Value -ne '' })
    if ($vals.Count -eq 0) { return @{ alive = $false; why = 'keys-empty-values' } }
    return @{ alive = $true; why = '' }
  } catch {
    $code = $null
    if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
    if ($code -eq 401) { return @{ alive = $false; why = 'keys-401-auth-dead' } }
    # PS5.1：哈希表值不接受内联 if 语句，先赋变量再入表（pwsh7 Parser 会放行的版本差坑）
    $whyCode = if ($code) { "keys-http-$code" } else { 'keys-unreachable' }
    return @{ alive = $false; why = $whyCode }
  }
}

function Write-L2Flag {
  param([string]$Reason, [string]$Detail)
  $payload = @{ reason = $Reason; ts = (Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz'); detail = $Detail } | ConvertTo-Json -Compress
  Set-Content -Path $l2Flag -Value $payload -Encoding UTF8
  Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz') l2-flag reason=$Reason detail=$Detail"
}

# ── 单实例互斥（v3；跨会话命名 Mutex；函数定义已就绪后再抢锁）──
$created = $false
$mutex = New-Object System.Threading.Mutex($true, 'Global\TrimodelWatchdogSingleton', [ref]$created)
if (-not $created) { return }   # 已有实例在跑（计划任务 5min 重复或手工拉起），立即退出
if ($SelfTest) {
  # 自测钩子：验证互斥锁+业务探针分诊可达性，不进入常驻循环（生产禁用）
  Write-Output "SELFTEST mutex-created=$created"
  $biz = Test-BusinessProbe
  Write-Output "SELFTEST business-probe alive=$($biz.alive) why=$($biz.why)"
  return
}

$rounds = 0
Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz') watchdog-v3 started pid=$PID"
while ($true) {
  $up = $false
  $healthState = 'down'
  try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:3333/health' -TimeoutSec 8 -UseBasicParsing; if ($r.StatusCode -eq 200) { $up = $true; $healthState = 'up' } } catch { }

  if (-not $up) {
    # 分支①：进程死 → L1 拉起 →10s 复探；连续 3 轮无效 → L2 标记
    Start-Process -FilePath 'wscript.exe' -ArgumentList ('"' + $launchVbs + '"') -WindowStyle Hidden
    Start-Sleep -Seconds 10
    try { $r2 = Invoke-WebRequest -Uri 'http://127.0.0.1:3333/health' -TimeoutSec 8 -UseBasicParsing; if ($r2.StatusCode -eq 200) { $up = $true } } catch { }
    $rounds = if ($up) { 0 } else { $rounds + 1 }
    Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz') revive attempt up=$up rounds=$rounds"
    if ($rounds -ge $maxRounds) {
      Write-L2Flag -Reason 'revive-exhausted' -Detail "health down after $rounds revive rounds"
      $rounds = 0   # 标记已写，计数归零等 L2 处置；不无限刷标记（L2 成功前 60s 后会再判再写=幂等）
    }
  } else {
    # /health 200：业务探针分诊（auth 死态跳 L1 直 L2）
    $biz = Test-BusinessProbe
    if ($biz.alive) {
      if ($rounds -gt 0) { Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz') recovered rounds-reset" }
      $rounds = 0
    } else {
      Write-L2Flag -Reason 'auth-dead' -Detail $biz.why
    }
  }
  Start-Sleep -Seconds 60
}
