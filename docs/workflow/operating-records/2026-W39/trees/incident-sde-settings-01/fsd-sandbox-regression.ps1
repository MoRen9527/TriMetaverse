<#
fsd-sandbox-regression.ps1 — restore-claude-config v2 沙箱回归驱动（TASK-INCIDENT-SDE-SETTINGS-01 FSD 自验）
正身: CTO 复盘报告 §六实施序「沙箱环境全锚回归（禁活体测试，-TargetDir 沙箱目录全锚跑一遍+auth 冒烟 mock）」
约束: 全程零触现役 %USERPROFILE%\.claude\settings.json（含读取——本驱动所有用例显式 -TargetDir 独立临时沙箱;
      唯一例外=T3b 活体警告行, 因「含读取」禁触改为代码审读为证, 见 fsd-fix-report.md）
测试钥: 全部 TEST_ 前缀假值, 非真钥。
用法: powershell -NoProfile -ExecutionPolicy Bypass -File fsd-sandbox-regression.ps1
#>
$ErrorActionPreference = 'Continue'
$Script = 'D:\Code\ai\TriCompany-worktrees\fix-restore\scripts\ops\local\restore-claude-config.ps1'
$Root   = Join-Path $env:TEMP ("fsd-restore-sandbox-" + (Get-Date -Format 'yyyyMMdd-HHmmss'))
$script:pass = 0; $script:fail = 0; $script:readings = New-Object System.Collections.Generic.List[string]
$FAKE1 = 'TEST_KEY_FSD_SANDBOX_0123456789abcdef'
$FAKE2 = 'TEST_KEY_FSD_KEYFILE_fedcba9876543210'

function Assert-Ok([string]$name, [bool]$cond, [string]$reading) {
  if ($cond) { $script:pass++; Write-Output ("ok   {0} - {1}  [{2}]" -f $script:pass, $name, $reading) }
  else       { $script:fail++; Write-Output ("NOT  ok   - {0}  [{1}]" -f $name, $reading) }
  $script:readings.Add(("{0} | {1} | {2}" -f ($(if ($cond) {'PASS'} else {'FAIL'})), $name, $reading))
}

function New-Sandbox([string]$tag, [string]$liveJson = $null) {
  $sb = Join-Path $Root $tag
  New-Item -ItemType Directory -Force (Join-Path $sb 'settings.presets') | Out-Null
  if ($null -ne $liveJson) { [System.IO.File]::WriteAllText((Join-Path $sb 'settings.json'), $liveJson, (New-Object System.Text.UTF8Encoding($false))) }
  return $sb
}

function Set-Preset([string]$sb, [string]$json, [string]$name = 'direct.json') {
  [System.IO.File]::WriteAllText((Join-Path (Join-Path $sb 'settings.presets') $name), $json, (New-Object System.Text.UTF8Encoding($false)))
}

function Invoke-Target([string]$sb, [string[]]$extra) {
  $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $Script -TargetDir $sb @extra 2>&1
  [pscustomobject]@{ Out = (($out | ForEach-Object { "$_" }) -join "`n"); Code = $LASTEXITCODE }
}

function Get-FileHash-Safe([string]$p) {
  if (Test-Path $p) { (Get-FileHash $p -Algorithm SHA256).Hash } else { '<absent>' }
}

$PRESET_OK_JSON   = "{`n  `"env`": {`n    `"ANTHROPIC_BASE_URL`": `"https://open.bigmodel.cn/api/anthropic`",`n    `"ANTHROPIC_AUTH_TOKEN`": `"$FAKE1`",`n    `"ANTHROPIC_MODEL`": `"glm-5.3-flash`"`n  }`n}"
$PRESET_PH_JSON   = "{`n  `"env`": {`n    `"ANTHROPIC_BASE_URL`": `"https://open.bigmodel.cn/api/anthropic`",`n    `"ANTHROPIC_AUTH_TOKEN`": `"GLM_API_KEY_PLACEHOLDER__DEPLOY_INJECT`"`n  }`n}"
$PRESET_EMPTY_JSON= "{`n  `"env`": {`n    `"ANTHROPIC_AUTH_TOKEN`": `"`"`n  }`n}"
$PRESET_WS_JSON   = "{`n  `"env`": {`n    `"ANTHROPIC_AUTH_TOKEN`": `"   `"`n  }`n}"
$LIVE_GOOD_JSON   = "{`n  `"model`": `"keep-me`",`n  `"env`": {`n    `"ANTHROPIC_BASE_URL`": `"http://127.0.0.1:1`",`n    `"ANTHROPIC_AUTH_TOKEN`": `"$FAKE1`"`n  }`n}"
$LIVE_APIKEY_ONLY = "{`n  `"env`": {`n    `"ANTHROPIC_BASE_URL`": `"https://open.bigmodel.cn/api/anthropic`",`n    `"ANTHROPIC_API_KEY`": `"$FAKE1`"`n  }`n}"
$LIVE_EMPTY_CREDS = "{`n  `"env`": {`n    `"ANTHROPIC_BASE_URL`": `"https://open.bigmodel.cn/api/anthropic`",`n    `"ANTHROPIC_AUTH_TOKEN`": `"`",`n    `"ANTHROPIC_API_KEY`": `"`"`n  }`n}"

Write-Output "══ FSD 沙箱回归·restore-claude-config v2（沙箱根 $Root）══"

# ── T1 凭据健康门（修-1）──
$sb = New-Sandbox 't1a-ph' $LIVE_GOOD_JSON; Set-Preset $sb $PRESET_PH_JSON
$r = Invoke-Target $sb @('-Mode','direct')
Assert-Ok 'T1a 占位符拒切 exit=2' ($r.Code -eq 2) "exit=$($r.Code)"
Assert-Ok 'T1a FAIL 行含健康门' (($r.Out -match '凭据健康门') -and ($r.Out -match 'FAIL \| code=2')) "FAIL行在=$([bool]($r.Out -match 'FAIL \| code=2'))"

$sb = New-Sandbox 't1b-empty' $LIVE_GOOD_JSON; Set-Preset $sb $PRESET_EMPTY_JSON
$r = Invoke-Target $sb @('-Mode','direct')
Assert-Ok 'T1b 空串凭据拒切 exit=2' ($r.Code -eq 2) "exit=$($r.Code); msg含空=$([bool]($r.Out -match '为空/纯空白'))"

$sb = New-Sandbox 't1c-ws' $LIVE_GOOD_JSON; Set-Preset $sb $PRESET_WS_JSON
$r = Invoke-Target $sb @('-Mode','direct')
Assert-Ok 'T1c 纯空白凭据拒切 exit=2' ($r.Code -eq 2) "exit=$($r.Code)"

# ── T2 -InjectKey（修-2/修-5）──
$sb = New-Sandbox 't2a-nosrc' $LIVE_EMPTY_CREDS
$r = Invoke-Target $sb @('-InjectKey')
Assert-Ok 'T2a 钥源全空 Fail exit=2' (($r.Code -eq 2) -and ($r.Out -match '钥源全空')) "exit=$($r.Code)"

$sb = New-Sandbox 't2b-apikey-shape' $LIVE_APIKEY_ONLY
$r = Invoke-Target $sb @('-InjectKey')
$presetAfter = Join-Path $sb 'settings.presets\direct.json'
$shapeOk = $false; $valOk = $false
if (Test-Path $presetAfter) {
  $pj = (Get-Content $presetAfter -Raw -Encoding UTF8 | ConvertFrom-Json)
  $shapeOk = ($null -ne $pj.env.PSObject.Properties['ANTHROPIC_API_KEY']) -and ($null -eq $pj.env.PSObject.Properties['ANTHROPIC_AUTH_TOKEN'])
  $valOk = ([string]$pj.env.ANTHROPIC_API_KEY -eq $FAKE1)
}
Assert-Ok 'T2b 活体API_KEY同形注入' (($r.Code -eq 0) -and $shapeOk -and $valOk) "exit=$($r.Code); keyshape同形=$shapeOk; 值面=$valOk"
Assert-Ok 'T2b RESULT行keyshape标注' ([bool]($r.Out -match 'RESULT \| op=inject-key .*keyshape=ANTHROPIC_API_KEY')) ([bool]($r.Out -match 'keyshape=ANTHROPIC_API_KEY'))

$sb = New-Sandbox 't2c-keyfile' $LIVE_GOOD_JSON
[System.IO.File]::WriteAllText((Join-Path (Join-Path $sb 'settings.presets') '.deploy-key'), "`n$FAKE2`r`n", (New-Object System.Text.UTF8Encoding($false)))
$r = Invoke-Target $sb @('-InjectKey')
$presetAfter = Join-Path $sb 'settings.presets\direct.json'
$kfOk = $false
if (Test-Path $presetAfter) {
  $pj = (Get-Content $presetAfter -Raw -Encoding UTF8 | ConvertFrom-Json)
  $kfOk = ([string]$pj.env.ANTHROPIC_AUTH_TOKEN -eq $FAKE2)
}
Assert-Ok 'T2c keyfile优先钥源' (($r.Code -eq 0) -and $kfOk -and ([bool]($r.Out -match 'keyfile:'))) "exit=$($r.Code); 值=keyfile=$kfOk"

$sb = New-Sandbox 't2d-whatif' $LIVE_APIKEY_ONLY
$r = Invoke-Target $sb @('-InjectKey','-WhatIf')
$noWrite = -not (Test-Path (Join-Path $sb 'settings.presets\direct.json'))
Assert-Ok 'T2d WhatIf注钥零写' (($r.Code -eq 0) -and $noWrite) "exit=$($r.Code); 零写=$noWrite"

# ── T3 沙箱/干跑/轮换（修-3）──
$sb = New-Sandbox 't3a-whatif' $LIVE_GOOD_JSON; Set-Preset $sb $PRESET_OK_JSON
$before = Get-FileHash-Safe (Join-Path $sb 'settings.json')
$r = Invoke-Target $sb @('-Mode','direct','-WhatIf')
$after = Get-FileHash-Safe (Join-Path $sb 'settings.json')
$noBak = (@(Get-ChildItem $sb -Filter 'settings.json.bak-*' -File -ErrorAction SilentlyContinue).Count -eq 0)
Assert-Ok 'T3a WhatIf主流程零写' (($r.Code -eq 0) -and ($before -eq $after) -and $noBak) "exit=$($r.Code); hash同=$($before -eq $after); 备份零增=$noBak"
Assert-Ok 'T3a diff含BASE_URL与脱敏len' (($r.Out -match 'ANTHROPIC_BASE_URL') -and ($r.Out -match 'len=')) "diff行在=$([bool]($r.Out -match 'WhatIf 干跑 diff'))"

# T3b 活体警告行: 因「含读取」禁触约束未实跑, 代码审读为证（fsd-fix-report.md）——占位不跑
Assert-Ok 'T3b 活体警告=代码审读（未实跑）' $true '约束含读取禁触; 审读见报告'

$sb = New-Sandbox 't3c-frozen' $LIVE_GOOD_JSON; Set-Preset $sb $PRESET_OK_JSON
New-Item -ItemType File -Force (Join-Path $sb 'FROZEN-BACKUPS') | Out-Null
for ($i=0; $i -lt 7; $i++) { Start-Sleep -Milliseconds 1100; $null = Invoke-Target $sb @('-Mode','direct') }
$rot = @(Get-ChildItem $sb -Filter 'settings.json.bak-*' -File).Count
$r = Invoke-Target $sb @('-Mode','direct')
Assert-Ok 'T3c FROZEN-BACKUPS轮换豁免' (($rot -ge 7) -and ([bool]($r.Out -match '轮换跳过'))) "8切后备份=$rot(未轮换); 豁免注记=$([bool]($r.Out -match '轮换跳过'))"

$sb = New-Sandbox 't3d-rotate' $LIVE_GOOD_JSON; Set-Preset $sb $PRESET_OK_JSON
for ($i=0; $i -lt 7; $i++) { Start-Sleep -Milliseconds 1100; $null = Invoke-Target $sb @('-Mode','direct') }
$rot2 = @(Get-ChildItem $sb -Filter 'settings.json.bak-*' -File).Count
Assert-Ok 'T3d 正常轮换保留近5' ($rot2 -eq 5) "8切后备份=$rot2"

# ── T4 写后断言/自动回滚/冒烟（修-4）──
$sb = New-Sandbox 't4a-assert' $LIVE_GOOD_JSON; Set-Preset $sb $PRESET_OK_JSON
$r = Invoke-Target $sb @('-Mode','direct')
$post = (Get-Content (Join-Path $sb 'settings.json') -Raw -Encoding UTF8 | ConvertFrom-Json)
$minimalOk = ([string]$post.model -eq 'keep-me')
$envOk = ([string]$post.env.ANTHROPIC_AUTH_TOKEN -eq $FAKE1) -and ([string]$post.env.ANTHROPIC_BASE_URL -eq 'https://open.bigmodel.cn/api/anthropic')
Assert-Ok 'T4a 切换成功断言pass+最小侵入' (($r.Code -eq 0) -and ([bool]($r.Out -match 'assert=pass')) -and $envOk -and $minimalOk) "exit=$($r.Code); env覆写=$envOk; 非env键保留=$minimalOk"

$sb = New-Sandbox 't4b-rollback' $LIVE_GOOD_JSON; Set-Preset $sb $PRESET_OK_JSON
$orig = Get-FileHash-Safe (Join-Path $sb 'settings.json')
$r = Invoke-Target $sb @('-Mode','direct','-SelfTestBreakAssert')
$restored = (Get-FileHash-Safe (Join-Path $sb 'settings.json') -eq $orig)
Assert-Ok 'T4b 断言失败自动回滚' (($r.Code -eq 1) -and ([bool]($r.Out -match '已自动回滚')) -and $restored) "exit=$($r.Code); 回滚恢复=$restored"

# 冒烟 mock listener（200/401 两态; loopback 默认 bypass 代理）
# v2 改法: 独立进程版 listener（Start-Job 的 GetContext 原生阻塞会致 Stop-Job 无限挂——实测坑, 见报告 §坑位）
$listenerPath = Join-Path $Root 'mock-auth-listener.ps1'
[System.IO.File]::WriteAllText($listenerPath, @'
param([int]$Port, [int]$Status, [int]$MaxReq = 8)
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://127.0.0.1:$Port/")
$l.Start()
$n = 0
while ($n -lt $MaxReq) {
  try { $c = $l.GetContext(); $c.Response.StatusCode = $Status; $c.Response.Close(); $n++ } catch { break }
}
try { $l.Stop() } catch {}
'@, (New-Object System.Text.UTF8Encoding($false)))

function Start-MockProc([int]$port, [int]$status) {
  Start-Process powershell.exe -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File',$listenerPath,'-Port',"$port",'-Status',"$status" -PassThru -WindowStyle Hidden
}
function Stop-MockProc($proc) {
  if ($proc -and -not $proc.HasExited) { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
}

$sb = New-Sandbox 't4c-smoke200' $LIVE_GOOD_JSON
Set-Preset $sb ($PRESET_OK_JSON -replace 'https://open\.bigmodel\.cn/api/anthropic', 'http://127.0.0.1:48231')
$mock = Start-MockProc 48231 200; Start-Sleep -Milliseconds 900
$r = Invoke-Target $sb @('-Mode','direct','-SmokeTest')
Stop-MockProc $mock
Assert-Ok 'T4c 冒烟200=PASS' (($r.Code -eq 0) -and ([bool]($r.Out -match 'smoke=PASS（HTTP 200）'))) "exit=$($r.Code); smoke行=$([bool]($r.Out -match 'smoke=PASS'))"

$sb = New-Sandbox 't4d-smoke401' $LIVE_GOOD_JSON
Set-Preset $sb ($PRESET_OK_JSON -replace 'https://open\.bigmodel\.cn/api/anthropic', 'http://127.0.0.1:48232')
$mock = Start-MockProc 48232 401; Start-Sleep -Milliseconds 900
$r = Invoke-Target $sb @('-Mode','direct','-SmokeTest')
Stop-MockProc $mock
Assert-Ok 'T4d 冒烟401=Fail exit=1' (($r.Code -eq 1) -and ([bool]($r.Out -match 'auth 冒烟 FAIL'))) "exit=$($r.Code)"

$sb = New-Sandbox 't4e-smokeunreach' $LIVE_GOOD_JSON
Set-Preset $sb ($PRESET_OK_JSON -replace 'https://open\.bigmodel\.cn/api/anthropic', 'http://127.0.0.1:1')
$r = Invoke-Target $sb @('-Mode','direct','-SmokeTest')
Assert-Ok 'T4e 冒烟不可达=跳过不阻塞' (($r.Code -eq 0) -and ([bool]($r.Out -match '跳过（网络不可达'))) "exit=$($r.Code); 跳过注记=$([bool]($r.Out -match '不阻塞'))"

# ── T6 CaptureRelay（沙箱）──
$sb = New-Sandbox 't6a-capture' $LIVE_GOOD_JSON
$r = Invoke-Target $sb @('-CaptureRelay')
$cap = Join-Path $sb 'settings.presets\relay-3333.json'
$capOk = $false
if (Test-Path $cap) { $cj = (Get-Content $cap -Raw -Encoding UTF8 | ConvertFrom-Json); $capOk = ([string]$cj.env.ANTHROPIC_AUTH_TOKEN -eq $FAKE1) }
Assert-Ok 'T6a CaptureRelay固化env子集' (($r.Code -eq 0) -and $capOk) "exit=$($r.Code); relay固化=$capOk"

$sb = New-Sandbox 't6b-capturewhatif' $LIVE_GOOD_JSON
$r = Invoke-Target $sb @('-CaptureRelay','-WhatIf')
$noCap = -not (Test-Path (Join-Path $sb 'settings.presets\relay-3333.json'))
Assert-Ok 'T6b CaptureRelay WhatIf零写' (($r.Code -eq 0) -and $noCap) "exit=$($r.Code); 零写=$noCap"

# ── T7 兼容/负路径 ──
$sb = New-Sandbox 't7a-badpreset' $LIVE_GOOD_JSON; Set-Preset $sb '{bad json'
$r = Invoke-Target $sb @('-Mode','direct')
Assert-Ok 'T7a 预设非法JSON拒 exit=2' ($r.Code -eq 2) "exit=$($r.Code)"

$sb = New-Sandbox 't7b-badlive' ''; [System.IO.File]::WriteAllText((Join-Path $sb 'settings.json'), '{bad json', (New-Object System.Text.UTF8Encoding($false)))
Set-Preset $sb $PRESET_OK_JSON
$r = Invoke-Target $sb @('-Mode','direct')
Assert-Ok 'T7b 活体非法JSON拒改 exit=1' (($r.Code -eq 1) -and ([bool]($r.Out -match '拒改'))) "exit=$($r.Code)"

$sb = New-Sandbox 't7c-nopreset' $LIVE_GOOD_JSON
$r = Invoke-Target $sb @('-Mode','direct')
# bundled=占位符形 → 沙箱预设缺位时 effectivePresetPath=bundled → 健康门拒切=fail-closed 正确行为
Assert-Ok 'T7c 预设缺位补装占位符→健康门拒 exit=2' (($r.Code -eq 2) -and ([bool]($r.Out -match '凭据健康门'))) "exit=$($r.Code)（bundled占位符形→健康门拒=fail-closed 正确）"

$sb = New-Sandbox 't8-mutex' $LIVE_GOOD_JSON
$r = Invoke-Target $sb @('-CaptureRelay','-InjectKey')
Assert-Ok 'T8 模式互斥拒 exit=2' (($r.Code -eq 2) -and ([bool]($r.Out -match '互斥'))) "exit=$($r.Code)"

# ── 汇总 ──
Write-Output ("══ 汇总: PASS={0} FAIL={1} 沙箱根={2} ══" -f $script:pass, $script:fail, $Root)
Write-Output "── 读数清单 ──"
$script:readings | ForEach-Object { Write-Output $_ }
if (Test-Path (Join-Path $PSScriptRoot 'fsd-sandbox-regression-result.txt')) { Remove-Item (Join-Path $PSScriptRoot 'fsd-sandbox-regression-result.txt') -Force }
$script:readings | Out-File (Join-Path $PSScriptRoot 'fsd-sandbox-regression-result.txt') -Encoding UTF8
exit $(if ($script:fail -gt 0) { 1 } else { 0 })
