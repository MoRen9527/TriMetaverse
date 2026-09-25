# trimodel-l3-toast.ps1 — L3 用户提醒层（TASK-TRIMODEL-RECOVERY-LADDER-01 波②）
# 触发条件：L2 标记在位且 3333 服务仍未恢复（双层探活）→ Windows 原生 toast（零第三方依赖）。
# 服务已恢复/无标记 → 安静退出（不弹不扰）。由 TriMLC cron 30min 节律调用（重提醒）。
# 文案四要素（CPO 人话纪律）：①出了什么事 ②现在什么状态 ③要你做什么 ④去哪看详情；禁术语禁恐慌体。
$ErrorActionPreference = 'SilentlyContinue'
$l2Flag = 'D:\Code\ai\TriMetaverse\.fade\trimodel-l2-flag'
$log = 'D:\Code\ai\TriMetaverse\.fade\trimodel-l3-toast.log'
$envFile = 'D:\Code\ai\TriModel\.env'
$ts = Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz'

if (-not (Test-Path $l2Flag)) { return }

function Read-ApiToken {
  try {
    foreach ($line in Get-Content -Path $envFile) {
      if ($line -match '^TRIMODEL_API_TOKEN=(.*)$') { return $Matches[1].Trim() }
    }
  } catch { }
  return ''
}

# 双层探活：已恢复 → 清 L2 标记（自愈）并安静退出
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
  Remove-Item -Path $l2Flag -Force
  Add-Content -Path $log -Value "L3TOAST | $ts | action=clear-flag | verdict=healthy | note=recovered-no-toast"
  return
}

# 仍异常 → 弹 toast（四要素）
$restoreCmd = 'powershell -NoProfile -ExecutionPolicy Bypass -File "D:\Code\ai\TriCompany\scripts\ops\local\restore-claude-direct.ps1"'
$statusCmd = 'powershell -NoProfile -ExecutionPolicy Bypass -File "D:\Code\ai\TriCompany\scripts\ops\local\restore-claude-direct.ps1" -UseKnownGood'
$line1 = 'TriModel 配置服务自动恢复没有成功'
$line2 = '您正在使用的 AI 服务不受影响；自动恢复已多次尝试未通过，需要您手动恢复一次'
$line3 = "复制下面这条命令粘贴到 PowerShell 回车即可：$restoreCmd"
$line4 = "想先看现状，可运行：$statusCmd"

try {
  [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
  [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null
  $template = @"
<toast><visual><binding template="ToastGeneric">
  <text>$line1</text>
  <text>$line2</text>
  <text>$line3</text>
  <text>$line4</text>
</binding></visual></toast>
"@
  $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
  $xml.LoadXml($template)
  $toast = New-Object Windows.UI.Notifications.ToastNotification($xml)
  $appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
  [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show($toast)
  Add-Content -Path $log -Value "L3TOAST | $ts | action=toast-shown | verdict=unhealthy health=$healthUp biz=$bizAlive"
} catch {
  Add-Content -Path $log -Value "L3TOAST | $ts | action=toast-failed | err=$($_.Exception.Message)"
}
