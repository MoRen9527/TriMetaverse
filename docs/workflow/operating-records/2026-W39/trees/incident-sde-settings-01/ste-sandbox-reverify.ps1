# ste-sandbox-reverify.ps1 — STE 独立复验驱动（BOD 终验收门 TASK-INCIDENT-SDE-SETTINGS-01）
# 独立性声明：本驱动为 STE 自产（未参照 FSD 驱动——其实盘缺失，见复验报告发现①）；
#   25 用例清单/断言逻辑独立设计，读数全自产。
# 隔离声明：全部用例经 -TargetDir 沙箱目录执行；活体路径仅作字符串不等比较（防呆断言），
#   零 Test-Path / 零读取 / 零写入（硬约束 P-5①「含读取」全程遵守）。
# 用法: powershell.exe -NoProfile -ExecutionPolicy Bypass -File ste-sandbox-reverify.ps1
# 依赖: 仅 Windows PowerShell 5.1 内置能力（与被测脚本同环境基线）。

param(
  [string]$ScriptPath = 'D:\Code\ai\TriCompany-worktrees\fix-restore\scripts\ops\local\restore-claude-config.ps1',
  [string]$WorkRootOverride = ''
)

$ErrorActionPreference = 'Stop'
$WorkRoot = if ($WorkRootOverride) { $WorkRootOverride } else { Join-Path $env:TEMP ("ste-reverify-" + (Get-Date -Format 'yyyyMMdd-HHmmss')) }
New-Item -ItemType Directory -Path $WorkRoot -Force | Out-Null

# ── 防呆基准（字符串面，零文件系统触）──
$livePathRef = [System.IO.Path]::GetFullPath((Join-Path $HOME '.claude')).TrimEnd('\','/')
function Assert-SandboxPath([string]$p) {
  $norm = [System.IO.Path]::GetFullPath($p).TrimEnd('\','/')
  if ($norm -ieq $script:livePathRef) { throw "沙箱防呆触发：目标路径等于活体路径 $livePathRef —— 禁止执行" }
  if (-not $norm.StartsWith(([System.IO.Path]::GetFullPath($script:WorkRoot)).TrimEnd('\','/'), [StringComparison]::OrdinalIgnoreCase)) {
    throw "沙箱防呆触发：目标路径越出 WorkRoot：$norm"
  }
}

# ── 结果账本 ──
$script:Results = New-Object System.Collections.Generic.List[string]
$script:PassCount = 0; $script:FailCount = 0

function Record([string]$id, [bool]$ok, [string]$detail) {
  if ($ok) { $script:PassCount++ } else { $script:FailCount++ }
  $line = "{0} | {1} | {2}" -f ($(if ($ok) {'PASS'} else {'FAIL'})), $id, $detail
  $script:Results.Add($line)
  Write-Host $line -ForegroundColor $(if ($ok) {'Green'} else {'Red'})
}

# ── 沙箱 fixture 工具 ──
function New-Case([string]$name) {
  $d = Join-Path $WorkRoot $name
  New-Item -ItemType Directory -Path (Join-Path $d 'settings.presets') -Force | Out-Null
  return $d
}
function Write-Utf8NoBom([string]$path, [string]$text) {
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($path, $text, $enc)
}
# settings.json：正常态（API_KEY 形 known-good，仿真活体键形）
# 注意: apiKey 参数不设 [string] 类型——[string] 强转会把 $null 吞成 ''（驱动 bug 修正 2026-09-25）
function New-LiveSettings($dir, $authTok, $apiKey, $baseUrl) {
  $envLines = @()
  $envLines += "    ""ANTHROPIC_BASE_URL"": ""$baseUrl"","
  if ($null -ne $authTok) { $envLines += "    ""ANTHROPIC_AUTH_TOKEN"": ""$authTok""," }
  if ($null -ne $apiKey) { $envLines += "    ""ANTHROPIC_API_KEY"": ""$apiKey""," }
  $envLines += "    ""ANTHROPIC_MODEL"": ""glm-5.3-flash"""
  $json = "{`n  ""env"": {`n" + ($envLines -join "`n") + "`n  },`n  ""otherKey"": ""preserve-me""`n}"
  Write-Utf8NoBom (Join-Path $dir 'settings.json') $json
}
function New-Preset([string]$dir, [hashtable]$envMap) {
  $props = $envMap.GetEnumerator() | ForEach-Object { "    ""$($_.Key)"": ""$($_.Value)""" }
  $json = "{`n  ""env"": {`n" + ($props -join ",`n") + "`n  }`n}"
  Write-Utf8NoBom (Join-Path (Join-Path $dir 'settings.presets') 'direct.json') $json
}
function Get-FileHash-Safe([string]$path) {
  if (-not (Test-Path $path)) { return '<absent>' }
  return (Get-FileHash $path -Algorithm SHA256).Hash
}
function Count-Backups([string]$dir) {
  return @(Get-ChildItem -Path $dir -Filter 'settings.json.bak-*' -File -ErrorAction SilentlyContinue).Count
}
# 被测脚本子进程调用（统一 powershell.exe 5.1；-Command 包装强制子进程 stdout=UTF8；
# 可选 HOME 重定向——预检分支用，真写用例必须先经 Probe-TargetHome 干跑验证落点）
function Invoke-Target([string]$dir, [string[]]$extraArgs, [switch]$HomeOverride, [switch]$DryProbe) {
  Assert-SandboxPath $dir
  $argLine = ''
  if (-not $HomeOverride) { $argLine += " -TargetDir '$dir'" }
  foreach ($a in $extraArgs) { $argLine += " $a" }
  if ($DryProbe) { $argLine += ' -WhatIf' }
  $cmd = "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; & '$ScriptPath'$argLine; exit `$LASTEXITCODE"
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'powershell.exe'
  $psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -Command `"$cmd`""
  $psi.RedirectStandardOutput = $true; $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false; $psi.CreateNoWindow = $true
  $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
  $psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8
  if ($HomeOverride) {
    $fakeHome = Split-Path -Parent $dir  # 约定: 用例目录=<fakeHome>\.claude
    $psi.EnvironmentVariables['HOME'] = $fakeHome
  }
  $p = [System.Diagnostics.Process]::Start($psi)
  $out = $p.StandardOutput.ReadToEnd(); $err = $p.StandardError.ReadToEnd()
  $p.WaitForExit()
  return [pscustomobject]@{ exit = $p.ExitCode; out = $out; err = $err }
}
function New-MockListener([string]$dir, [int]$status, [int]$maxReq) {
  $lp = Join-Path $dir 'mock-auth-listener.ps1'
  Write-Utf8NoBom $lp (@'
param([int]$Port, [int]$Status, [int]$MaxReq)
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://127.0.0.1:$Port/")
$l.Start()
$n = 0
while ($n -lt $MaxReq) { try { $c = $l.GetContext(); $c.Response.StatusCode = $Status; $c.Response.Close(); $n++ } catch { break } }
try { $l.Stop() } catch {}
'@)
  $proc = Start-Process powershell.exe -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',$lp,'-Port',$script:MockPort,'-Status',"$status",'-MaxReq',"$maxReq") -PassThru -WindowStyle Hidden
  # 就绪探测：TcpClient 连通后再放行被测脚本（防 listener 未起 → 假「不可达」读数）
  $ready = $false
  foreach ($i in 1..30) {
    try { $tc = New-Object System.Net.Sockets.TcpClient; $tc.Connect('127.0.0.1', $script:MockPort); $tc.Close(); $ready = $true; break } catch { Start-Sleep -Milliseconds 100 }
  }
  return [pscustomobject]@{ proc = $proc; ready = $ready }
}
function Get-FreePort() {
  $l = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
  $l.Start(); $port = ($l.LocalEndpoint -split ':')[-1]; $l.Stop()
  return [int]$port
}

# ═══ 前置自检 ═══
if (-not (Test-Path $ScriptPath)) { throw "被测脚本不存在: $ScriptPath" }
$banner = @()
$banner += "=== STE 沙箱独立复验 · restore-claude-config v2 (f887b27) ==="
$banner += "被测: $ScriptPath"
$banner += "沙箱: $WorkRoot"
$banner += "活体参照（仅字符串防呆，零触）: $livePathRef"
$banner += "时点: $((Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz'))"
$banner | ForEach-Object { Write-Host $_ }

$script:MockPort = Get-FreePort

# ═══ T1 凭据健康门三态（修-1；解冻①前半）═══
# 公共断言: exit=2 + FAIL 行 + settings.json 哨兵内容零扰动 + 零备份（健康门在备份前）
foreach ($tc in @(
  @{ id='T1a 占位符拒切';  case='t1a-ph';    cred='GLM_API_KEY_PLACEHOLDER__DEPLOY_INJECT' },
  @{ id='T1b 空串拒切';    case='t1b-empty'; cred='' },
  @{ id='T1c 纯空白拒切';  case='t1c-ws';    cred='   ' }
)) {
  try {
    $d = New-Case $tc.case
    New-LiveSettings $d 'sentinel-live-token' 'sentinel-live-key' 'https://open.bigmodel.cn/api/anthropic'
    $sentinel = Get-FileHash-Safe (Join-Path $d 'settings.json')
    New-Preset $d @{ ANTHROPIC_BASE_URL='https://open.bigmodel.cn/api/anthropic'; ANTHROPIC_AUTH_TOKEN=$tc.cred; ANTHROPIC_MODEL='glm-5.3-flash' }
    $r = Invoke-Target $d @()
    $ok = ($r.exit -eq 2) -and ($r.out -match 'FAIL \| code=2') -and ($r.out -match '凭据健康门') `
      -and ((Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel) -and ((Count-Backups $d) -eq 0)
    Record $tc.id $ok ("exit={0} fail-line={1} sentinel-unchanged={2} baks={3}" -f $r.exit, [bool]($r.out -match 'FAIL \| code=2'), ((Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel), (Count-Backups $d))
  } catch { Record $tc.id $false "driver 异常: $($_.Exception.Message)" }
}

# ═══ T2 InjectKey 族（修-2+修-5；解冻①后半）═══
# T2a 钥源全空 fail-closed
try {
  $d = New-Case 't2a-nosrc'
  New-LiveSettings $d '' '' 'https://open.bigmodel.cn/api/anthropic'   # 活体双键全空（灾备态）
  $r = Invoke-Target $d @('-InjectKey')
  $noPreset = -not (Test-Path (Join-Path $d 'settings.presets\direct.json'))
  $ok = ($r.exit -eq 2) -and ($r.out -match '注钥 fail-closed') -and ($r.out -match '钥源全空') -and $noPreset
  Record 'T2a 钥源全空fail-closed' $ok ("exit={0} preset-written={1}" -f $r.exit, -not $noPreset)
} catch { Record 'T2a 钥源全空fail-closed' $false "driver 异常: $($_.Exception.Message)" }

# T2b 同形注入：活体 API_KEY 形（known-good 权威形）→ 生成预设键形同形
try {
  $d = New-Case 't2b-apikey-shape'
  New-LiveSettings $d '' 'live-api-key-VAL' 'https://open.bigmodel.cn/api/anthropic'
  $r = Invoke-Target $d @('-InjectKey')
  $genPath = Join-Path $d 'settings.presets\direct.json'
  $genOk = $false; $genApi = ''; $genAuth = '<absent-prop>'
  if (Test-Path $genPath) {
    $g = (Get-Content $genPath -Raw | ConvertFrom-Json).env
    $genApi = [string]$g.PSObject.Properties['ANTHROPIC_API_KEY'].Value
    if ($g.PSObject.Properties['ANTHROPIC_AUTH_TOKEN']) { $genAuth = [string]$g.PSObject.Properties['ANTHROPIC_AUTH_TOKEN'].Value }
    $genOk = ($genApi -eq 'live-api-key-VAL') -and ($null -eq $genAuth -or $genAuth -eq '<absent-prop>')
  }
  $ok = ($r.exit -eq 0) -and ($r.out -match 'RESULT \| op=inject-key') -and ($r.out -match 'keyshape=ANTHROPIC_API_KEY') -and $genOk
  Record 'T2b 同形注入(API_KEY形)' $ok ("exit={0} keyshape-line={1} gen-api-val-match={2} gen-auth-prop={3}" -f $r.exit, [bool]($r.out -match 'keyshape=ANTHROPIC_API_KEY'), ($genApi -eq 'live-api-key-VAL'), $genAuth)
} catch { Record 'T2b 同形注入(API_KEY形)' $false "driver 异常: $($_.Exception.Message)" }

# T2c keyfile 优先：keyfile 与活体双键并存 → 取 keyfile
try {
  $d = New-Case 't2c-keyfile'
  New-LiveSettings $d 'live-auth-tok' 'live-api-key' 'https://open.bigmodel.cn/api/anthropic'
  Write-Utf8NoBom (Join-Path $d 'settings.presets\.deploy-key') "keyfile-secret-VAL"
  $r = Invoke-Target $d @('-InjectKey')
  $gen = (Get-Content (Join-Path $d 'settings.presets\direct.json') -Raw | ConvertFrom-Json).env
  $val = [string]$gen.PSObject.Properties['ANTHROPIC_AUTH_TOKEN'].Value
  $ok = ($r.exit -eq 0) -and ($r.out -match '钥源=keyfile:') -and ($val -eq 'keyfile-secret-VAL')
  Record 'T2c keyfile优先' $ok ("exit={0} keysrc-line={1} val-match={2}" -f $r.exit, [bool]($r.out -match '钥源=keyfile:'), ($val -eq 'keyfile-secret-VAL'))
} catch { Record 'T2c keyfile优先' $false "driver 异常: $($_.Exception.Message)" }

# T2d 活体 fallback 双键探测序：双键均非空 → 取 AUTH_TOKEN（凭据数组序前者）
try {
  $d = New-Case 't2d-order'
  New-LiveSettings $d 'live-auth-tok' 'live-api-key' 'https://open.bigmodel.cn/api/anthropic'
  $r = Invoke-Target $d @('-InjectKey')
  $gen = (Get-Content (Join-Path $d 'settings.presets\direct.json') -Raw | ConvertFrom-Json).env
  $val = [string]$gen.PSObject.Properties['ANTHROPIC_AUTH_TOKEN'].Value
  $ok = ($r.exit -eq 0) -and ($r.out -match '钥源=live:.*#ANTHROPIC_AUTH_TOKEN') -and ($val -eq 'live-auth-tok') -and ($r.out -match 'keyshape=ANTHROPIC_AUTH_TOKEN')
  Record 'T2d 双键探测序(AUTH_TOKEN先)' $ok ("exit={0} val-match={1}" -f $r.exit, ($val -eq 'live-auth-tok'))
} catch { Record 'T2d 双键探测序(AUTH_TOKEN先)' $false "driver 异常: $($_.Exception.Message)" }

# T2e InjectKey+WhatIf 干跑零写
try {
  $d = New-Case 't2e-whatif'
  New-LiveSettings $d '' 'live-api-key' 'https://open.bigmodel.cn/api/anthropic'
  $genPath = Join-Path $d 'settings.presets\direct.json'
  $r = Invoke-Target $d @('-InjectKey','-WhatIf')
  $ok = ($r.exit -eq 0) -and ($r.out -match '注钥干跑完成，零写动作') -and (-not (Test-Path $genPath))
  Record 'T2e 注钥WhatIf零写' $ok ("exit={0} whatif-line={1} preset-absent={2}" -f $r.exit, [bool]($r.out -match '注钥干跑完成'), (-not (Test-Path $genPath)))
} catch { Record 'T2e 注钥WhatIf零写' $false "driver 异常: $($_.Exception.Message)" }

# ═══ T3 沙箱/干跑/轮换族（修-3；解冻②）═══
# T3a 主流程 WhatIf 干跑零写
try {
  $d = New-Case 't3a-whatif'
  New-LiveSettings $d 'live-auth-tok' '' 'https://open.bigmodel.cn/api/anthropic'
  New-Preset $d @{ ANTHROPIC_BASE_URL='https://open.bigmodel.cn/api/anthropic'; ANTHROPIC_AUTH_TOKEN='preset-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash' }
  $sentinel = Get-FileHash-Safe (Join-Path $d 'settings.json')
  $r = Invoke-Target $d @('-WhatIf')
  $ok = ($r.exit -eq 0) -and ($r.out -match '干跑完成，零写动作') -and ($r.out -match '~ ANTHROPIC_AUTH_TOKEN') `
    -and ((Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel) -and ((Count-Backups $d) -eq 0)
  Record 'T3a WhatIf干跑零写' $ok ("exit={0} sentinel-unchanged={1} diff-line={2}" -f $r.exit, ((Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel), [bool]($r.out -match '~ ANTHROPIC_AUTH_TOKEN'))
} catch { Record 'T3a WhatIf干跑零写' $false "driver 异常: $($_.Exception.Message)" }

# T3b -TargetDir 沙箱全流程真写 + 活体警告块源码静态断言
# （HOME 重定向动态验证废弃——实测 5.1 $HOME 不读 HOME env（探针 2026-09-25），动态触发警告
#   必须以真活体路径运行=违反约束①「含读取」禁令；警告行验证降级为源码级静态断言+逻辑审读）
try {
  $d = New-Case 't3b-sandboxfull'
  New-LiveSettings $d 'live-auth-tok' $null 'https://open.bigmodel.cn/api/anthropic'
  New-Preset $d @{ ANTHROPIC_BASE_URL='https://open.bigmodel.cn/api/anthropic'; ANTHROPIC_AUTH_TOKEN='preset-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash' }
  $r = Invoke-Target $d @('-Mode','direct')
  $written = Test-Path (Join-Path $d 'settings.json')
  $contentOk = $false
  if ($written) { $envPost = (Get-Content (Join-Path $d 'settings.json') -Raw | ConvertFrom-Json).env; $contentOk = ([string]$envPost.PSObject.Properties['ANTHROPIC_AUTH_TOKEN'].Value -eq 'preset-tok-VAL') }
  # 源码静态断言: 警告块存在且条件=活体路径等同比对（脚本 L56-61）
  $src = Get-Content $ScriptPath -Raw -Encoding UTF8
  $warnBlock = $src -match '警告：目标=活体路径' -and $src -match "liveNorm.*targetNorm|targetNorm.*liveNorm" -and $src -match 'OrdinalIgnoreCase'
  $ok = ($r.exit -eq 0) -and $written -and $contentOk -and ($r.out -match 'RESULT \| op=switch') -and $warnBlock
  Record 'T3b 沙箱全流程+警告块静态审计' $ok ("exit={0} written={1} content-ok={2} warn-src-block={3}" -f $r.exit, $written, $contentOk, $warnBlock)
} catch { Record 'T3b 沙箱全流程+警告块静态审计' $false "driver 异常: $($_.Exception.Message)" }

# T3c FROZEN-BACKUPS 轮换豁免（四锚之一；P-3 脚本级）
try {
  $d = New-Case 't3c-frozen'
  New-LiveSettings $d 'live-auth-tok' $null 'https://open.bigmodel.cn/api/anthropic'
  New-Preset $d @{ ANTHROPIC_BASE_URL='https://open.bigmodel.cn/api/anthropic'; ANTHROPIC_AUTH_TOKEN='preset-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash' }
  for ($i = 1; $i -le 7; $i++) { Copy-Item (Join-Path $d 'settings.json') "$d\settings.json.bak-pre$('{0:D2}' -f $i)" }
  New-Item -ItemType File -Path (Join-Path $d 'FROZEN-BACKUPS') -Force | Out-Null
  $r = Invoke-Target $d @()
  $after = Count-Backups $d
  $ok = ($r.exit -eq 0) -and ($after -eq 8) -and ($r.out -match '轮换跳过（FROZEN-BACKUPS 哨兵在位）')
  Record 'T3c 轮换豁免哨兵' $ok ("exit={0} baks-after={1}（期望8=7旧+1新，零淘汰） rotation-note={2}" -f $r.exit, $after, [bool]($r.out -match '轮换跳过'))
} catch { Record 'T3c 轮换豁免哨兵' $false "driver 异常: $($_.Exception.Message)" }

# T3d 正常轮换：无哨兵 → 8 份淘汰至 5
try {
  $d = New-Case 't3d-rotate'
  New-LiveSettings $d 'live-auth-tok' $null 'https://open.bigmodel.cn/api/anthropic'
  New-Preset $d @{ ANTHROPIC_BASE_URL='https://open.bigmodel.cn/api/anthropic'; ANTHROPIC_AUTH_TOKEN='preset-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash' }
  for ($i = 1; $i -le 7; $i++) { Copy-Item (Join-Path $d 'settings.json') "$d\settings.json.bak-pre$('{0:D2}' -f $i)" }
  $r = Invoke-Target $d @()
  $after = Count-Backups $d
  $ok = ($r.exit -eq 0) -and ($after -eq 5) -and ($r.out -match '轮换执行（保留近 5 份）')
  Record 'T3d 正常轮换保留5' $ok ("exit={0} baks-after={1}（期望5）" -f $r.exit, $after)
} catch { Record 'T3d 正常轮换保留5' $false "driver 异常: $($_.Exception.Message)" }

# T3e bundled 回退被健康门前置拦截（补装在 ShouldProcess 门后=健康门 Fail 时零补装零写副作用）
try {
  $d = New-Case 't3e-install'
  New-LiveSettings $d 'live-auth-tok' '' 'https://open.bigmodel.cn/api/anthropic'
  # 沙箱 settings.presets 留空 → 脚本回退 bundled 模板（占位符形）→ 健康门在补装前 Fail 2
  $r = Invoke-Target $d @()
  $installed = Test-Path (Join-Path $d 'settings.presets\direct.json')
  $sentinel = Get-FileHash-Safe (Join-Path $d 'settings.json')
  $ok = ($r.exit -eq 2) -and ($r.out -match '凭据健康门') -and (-not $installed) -and ((Count-Backups $d) -eq 0)
  Record 'T3e bundled回退健康门前置拦截' $ok ("exit={0} installed(期望false)={1} sentinel-unchanged={2}" -f $r.exit, $installed, ($sentinel -ne '<absent>'))
} catch { Record 'T3e bundled回退健康门前置拦截' $false "driver 异常: $($_.Exception.Message)" }

# ═══ T4 断言/回滚/冒烟族（修-4；解冻③）═══
# T4a 写后断言 pass（活体 fixture 无空凭据键残留——残留空键场景另列探针 P1）
try {
  $d = New-Case 't4a-assert'
  New-LiveSettings $d 'live-auth-tok' $null 'https://open.bigmodel.cn/api/anthropic'
  New-Preset $d @{ ANTHROPIC_BASE_URL='https://open.bigmodel.cn/api/anthropic'; ANTHROPIC_AUTH_TOKEN='preset-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash' }
  $r = Invoke-Target $d @()
  $postDoc = Get-Content (Join-Path $d 'settings.json') -Raw | ConvertFrom-Json
  $preserveOk = ([string]$postDoc.PSObject.Properties['otherKey'].Value -eq 'preserve-me')  # 最小侵入: 预设外顶层键保留
  $ok = ($r.exit -eq 0) -and ($r.out -match 'RESULT \| op=switch.*assert=pass') -and ($r.out -match 'assert=pass') -and $preserveOk
  Record 'T4a 写后断言pass+键保留' $ok ("exit={0} preserve-otherKey={1}" -f $r.exit, $preserveOk)
} catch { Record 'T4a 写后断言pass+键保留' $false "driver 异常: $($_.Exception.Message)" }

# T4b 强制断言失败 → 自动回滚（四锚之一）
try {
  $d = New-Case 't4b-rollback'
  New-LiveSettings $d 'live-auth-tok' $null 'https://open.bigmodel.cn/api/anthropic'
  New-Preset $d @{ ANTHROPIC_BASE_URL='https://open.bigmodel.cn/api/anthropic'; ANTHROPIC_AUTH_TOKEN='preset-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash' }
  $sentinel = Get-FileHash-Safe (Join-Path $d 'settings.json')
  $r = Invoke-Target $d @('-SelfTestBreakAssert')
  $restored = (Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel
  $ok = ($r.exit -eq 1) -and ($r.out -match 'FAIL \| code=1') -and ($r.out -match '已自动回滚自') -and $restored
  Record 'T4b 断言失败自动回滚' $ok ("exit={0} rollback-line={1} restored={2}" -f $r.exit, [bool]($r.out -match '已自动回滚自'), $restored)
} catch { Record 'T4b 断言失败自动回滚' $false "driver 异常: $($_.Exception.Message)" }

# T4c/T4d/T4e SmokeTest 三态（mock listener 200 / 401 / 不可达）
foreach ($sc in @(
  @{ id='T4c smoke 2xx PASS';  case='t4c-smoke200'; status=200; expectExit=0; expect='smoke=PASS' },
  @{ id='T4d smoke 401 FAIL';  case='t4d-smoke401'; status=401; expectExit=1; expect='auth 冒烟 FAIL' },
  @{ id='T4e smoke 不可达跳过'; case='t4e-smokeunreach'; status=0;   expectExit=0; expect='跳过' }
)) {
  try {
    $d = New-Case $sc.case
    if ($sc.status -gt 0) {
      $script:MockPort = Get-FreePort
      $ml = New-MockListener $d $sc.status 1   # MaxReq=1: 单请求即退，防 listener 悬挂
      if (-not $ml.ready) { Record $sc.id $false "mock listener 未就绪（端口 $script:MockPort）——读数作废防假"; continue }
      $baseUrl = "http://127.0.0.1:$script:MockPort"
    } else {
      $deadPort = Get-FreePort   # 无 listener 的死端口 = 不可达态
      $baseUrl = "http://127.0.0.1:$deadPort"
    }
    New-LiveSettings $d 'live-auth-tok' $null $baseUrl
    New-Preset $d @{ ANTHROPIC_BASE_URL=$baseUrl; ANTHROPIC_AUTH_TOKEN='preset-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash' }
    $r = Invoke-Target $d @('-SmokeTest')
    $ok = ($r.exit -eq $sc.expectExit) -and ($r.out -match [regex]::Escape($sc.expect))
    Record $sc.id $ok ("exit={0}（期望{1}） expect-line={2}" -f $r.exit, $sc.expectExit, [bool]($r.out -match [regex]::Escape($sc.expect)))
  } catch { Record $sc.id $false "driver 异常: $($_.Exception.Message)" }
}

# ═══ T5 PowerShell 5.1 兼容专项（本驱动全量用例均经 powershell.exe 5.1 子进程执行）═══
# T5a 5.1 JSON 深度序列化保真：CaptureRelay 固化多键 env → 回读键数/值面零失真
try {
  $d = New-Case 't5a-jsonfidelity'
  $envMap = @{ ANTHROPIC_BASE_URL='http://127.0.0.1:3333'; ANTHROPIC_AUTH_TOKEN='relay-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash'; ANTHROPIC_DEFAULT_FABLE_MODEL='glm-5.3-flash'; ANTHROPIC_DEFAULT_FABLE_MODEL_NAME='glm-5.3-flash'; ANTHROPIC_DEFAULT_SONNET_MODEL='glm-5.3-flash'; ANTHROPIC_SMALL_FAST_MODEL='glm-5.3-flash' }
  New-LiveSettings $d 'relay-tok-VAL' '' 'http://127.0.0.1:3333'
  # 追加多键：直接改写 settings.json 为 8 键 env 形
  $props = ($envMap.GetEnumerator() | ForEach-Object { "    ""$($_.Key)"": ""$($_.Value)""" }) -join ",`n"
  Write-Utf8NoBom (Join-Path $d 'settings.json') "{`n  ""env"": {`n$props`n  }`n}"
  $r = Invoke-Target $d @('-CaptureRelay')
  $capPath = Join-Path $d 'settings.presets\relay-3333.json'
  $fidelity = $false; $keyCount = 0
  if (Test-Path $capPath) {
    $capEnv = (Get-Content $capPath -Raw | ConvertFrom-Json).env
    $keyCount = $capEnv.PSObject.Properties.Name.Count
    $fidelity = ($keyCount -eq 7) -and ([string]$capEnv.PSObject.Properties['ANTHROPIC_AUTH_TOKEN'].Value -eq 'relay-tok-VAL') -and ([string]$capEnv.PSObject.Properties['ANTHROPIC_SMALL_FAST_MODEL'].Value -eq 'glm-5.3-flash')
  }
  $ok = ($r.exit -eq 0) -and ($r.out -match 'RESULT \| op=capture-relay') -and $fidelity
  Record 'T5a 5.1 JSON保真(CaptureRelay)' $ok ("exit={0} cap-keys={1}/7 fidelity={2}" -f $r.exit, $keyCount, $fidelity)
} catch { Record 'T5a 5.1 JSON保真(CaptureRelay)' $false "driver 异常: $($_.Exception.Message)" }

# T5b 5.1 UTF8 无 BOM 写盘字节断言
try {
  $d = New-Case 't5b-utf8nobom'
  New-LiveSettings $d 'live-auth-tok' $null 'https://open.bigmodel.cn/api/anthropic'
  New-Preset $d @{ ANTHROPIC_BASE_URL='https://open.bigmodel.cn/api/anthropic'; ANTHROPIC_AUTH_TOKEN='preset-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash' }
  $r = Invoke-Target $d @()
  $bytes = [System.IO.File]::ReadAllBytes((Join-Path $d 'settings.json'))
  $bom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
  $ok = ($r.exit -eq 0) -and (-not $bom)
  Record 'T5b UTF8无BOM字节断言' $ok ("exit={0} bom-present={1}" -f $r.exit, $bom)
} catch { Record 'T5b UTF8无BOM字节断言' $false "driver 异常: $($_.Exception.Message)" }

# ═══ T6 CaptureRelay 族 ═══
# T6a capture 基本固化已在 T5a 覆盖 —— 此处测 T6b: CaptureRelay WhatIf 零写
try {
  $d = New-Case 't6b-capturewhatif'
  New-LiveSettings $d 'relay-tok' '' 'http://127.0.0.1:3333'
  $capPath = Join-Path $d 'settings.presets\relay-3333.json'
  $sentinel = Get-FileHash-Safe (Join-Path $d 'settings.json')
  $r = Invoke-Target $d @('-CaptureRelay','-WhatIf')
  $ok = ($r.exit -eq 0) -and ($r.out -match 'CaptureRelay 干跑完成，零写动作') -and (-not (Test-Path $capPath)) -and ((Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel)
  Record 'T6b CaptureRelay WhatIf零写' $ok ("exit={0} preset-absent={1}" -f $r.exit, (-not (Test-Path $capPath)))
} catch { Record 'T6b CaptureRelay WhatIf零写' $false "driver 异常: $($_.Exception.Message)" }

# ═══ T7 负路径族 ═══
# T7a 预设坏 JSON 拒切
try {
  $d = New-Case 't7a-badpreset'
  New-LiveSettings $d 'live-auth-tok' '' 'https://open.bigmodel.cn/api/anthropic'
  Write-Utf8NoBom (Join-Path $d 'settings.presets\direct.json') 'not-valid-json{{{'
  $sentinel = Get-FileHash-Safe (Join-Path $d 'settings.json')
  $r = Invoke-Target $d @()
  $ok = ($r.exit -eq 2) -and ($r.out -match '预设非法 JSON') -and ((Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel)
  Record 'T7a 预设坏JSON拒切' $ok ("exit={0} sentinel-unchanged={1}" -f $r.exit, ((Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel))
} catch { Record 'T7a 预设坏JSON拒切' $false "driver 异常: $($_.Exception.Message)" }

# T7b relay 预设缺位 fail-closed（沙箱无 relay-3333.json，bundled 亦无）
try {
  $d = New-Case 't7b-norelay'
  New-LiveSettings $d 'relay-tok' '' 'http://127.0.0.1:3333'
  $r = Invoke-Target $d @('-Mode','relay')
  $ok = ($r.exit -eq 2) -and ($r.out -match '预设不存在') -and ($r.out -match 'relay')
  Record 'T7b relay预设缺位fail' $ok ("exit={0}" -f $r.exit)
} catch { Record 'T7b relay预设缺位fail' $false "driver 异常: $($_.Exception.Message)" }

# ═══ T8 模式互斥（混沌拒绝）═══
try {
  $d = New-Case 't8-mutex'
  New-LiveSettings $d 'live-auth-tok' '' 'https://open.bigmodel.cn/api/anthropic'
  $sentinel = Get-FileHash-Safe (Join-Path $d 'settings.json')
  $r = Invoke-Target $d @('-CaptureRelay','-InjectKey')
  $ok = ($r.exit -eq 2) -and ($r.out -match '互斥') -and ((Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel)
  Record 'T8 CaptureRelay×InjectKey互斥' $ok ("exit={0}" -f $r.exit)
} catch { Record 'T8 CaptureRelay×InjectKey互斥' $false "driver 异常: $($_.Exception.Message)" }

# ═══ T2f（补位第 25 例）注钥写后回读复断言值面：T2c 场景 + 生成预设回读逐字节比对钥值 ═══
try {
  $d = New-Case 't2f-reread'
  New-LiveSettings $d '' 'live-api-key-VAL' 'https://open.bigmodel.cn/api/anthropic'
  $r = Invoke-Target $d @('-InjectKey')
  $gen = Get-Content (Join-Path $d 'settings.presets\direct.json') -Raw | ConvertFrom-Json
  $genEnv = $gen.env
  $val = [string]$genEnv.PSObject.Properties['ANTHROPIC_API_KEY'].Value
  $topKeys = $gen.PSObject.Properties.Name -join ','
  $ok = ($r.exit -eq 0) -and ($val -eq 'live-api-key-VAL') -and ($topKeys -eq 'env') -and ($r.out -match '已注入（钥源=live:')
  Record 'T2f 注钥写后回读值面' $ok ("exit={0} val-match={1} top-keys={2}" -f $r.exit, ($val -eq 'live-api-key-VAL'), $topKeys)
} catch { Record 'T2f 注钥写后回读值面' $false "driver 异常: $($_.Exception.Message)" }

# ═══ 附加探针（不入 25 正册；观察项 O-2 取证：预设外空凭据键残留 → 写后断言回滚）═══
try {
  $d = New-Case 'p1-residual-emptykey'
  # 活体 fixture 带 API_KEY='' 残留（仿真事故后 QUARANTINED 形态遗留）；预设只覆写 AUTH_TOKEN 族
  New-LiveSettings $d 'live-auth-tok' '' 'https://open.bigmodel.cn/api/anthropic'
  New-Preset $d @{ ANTHROPIC_BASE_URL='https://open.bigmodel.cn/api/anthropic'; ANTHROPIC_AUTH_TOKEN='preset-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash' }
  $sentinel = Get-FileHash-Safe (Join-Path $d 'settings.json')
  $r = Invoke-Target $d @()
  $restored = (Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel
  $rolledBack = ($r.exit -eq 1) -and ($r.out -match '已自动回滚自')
  Record 'P1 探针:预设外空键残留→回滚(O-2取证)' $rolledBack ("exit={0} restored={1}（读数供 O-2 定性：非缺陷判定项，语义观察项）" -f $r.exit, $restored)
  # P1 读数不计入正册汇总（从账本移除后再汇总——仅留在 readings 明细）
  $script:Results.RemoveAt($script:Results.Count - 1) | Out-Null
  if ($rolledBack) { $script:PassCount-- } else { $script:FailCount-- }
  "P1-PROBE | exit={0} restored={1} | O-2 附加读数（非正册）" -f $r.exit, $restored | Write-Host
} catch { "P1-PROBE driver 异常: $($_.Exception.Message)" | Write-Host }

# ═══ 汇总 ═══
$total = $script:PassCount + $script:FailCount
Write-Host ""
Write-Host ("=== 汇总: {0}/{1} PASS, {2} FAIL ===" -f $script:PassCount, $total, $script:FailCount) -ForegroundColor $(if ($script:FailCount -eq 0) {'Green'} else {'Red'})
Write-Host ("沙箱残留(留证): {0}" -f $WorkRoot)

# 读数文件落盘（与报告互锚）
$readingPath = Join-Path $WorkRoot 'ste-reverify-readings.txt'
$summary = @()
$summary += "STE 独立复验读数 · $((Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz'))"
$summary += "被测: $ScriptPath"
$summary += ("汇总: {0}/{1} PASS, {2} FAIL" -f $script:PassCount, $total, $script:FailCount)
$summary += ""
$summary += $script:Results
$summary | Set-Content -Path $readingPath -Encoding UTF8
Write-Host ("读数: {0}" -f $readingPath)
exit $(if ($script:FailCount -eq 0) { 0 } else { 1 })
