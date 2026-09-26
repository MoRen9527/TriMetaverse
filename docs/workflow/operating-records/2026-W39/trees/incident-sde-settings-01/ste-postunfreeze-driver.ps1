# ste-postunfreeze-driver.ps1 — STE 解冻后复验驱动（TASK-INCIDENT-SDE-SETTINGS-01 两段验收·第一段）
# 范围（BOD 11:19 令·COO 11:22 派工）: a) 四锚沙箱对 dev 合成形态（2d08d7c）复跑（merge 无回归验证）;
#   b) CaptureRelay 沙箱固化演练（CTO 建议项·部署日 3333 健康窗预演）。
# 独立性/隔离声明同前驱动（ste-sandbox-reverify.ps1）: 读数自产; 全程 -TargetDir 沙箱;
#   活体路径仅字符串防呆参照，零 Test-Path/零读取/零写入; dev 现役态只验不改（被测脚本自 dev 主树直读执行，
#   零写入仓库面——运行前后 git status diff 另行留痕于报告）。
# 用法: powershell.exe -NoProfile -ExecutionPolicy Bypass -File ste-postunfreeze-driver.ps1
# 依赖: 仅 Windows PowerShell 5.1 内置能力（与被测脚本同环境基线）。

param(
  [string]$ScriptPath = 'D:\Code\ai\TriCompany\scripts\ops\local\restore-claude-config.ps1',
  [string]$FixBranchScript = 'D:\Code\ai\TriCompany-worktrees\fix-restore\scripts\ops\local\restore-claude-config.ps1',
  [string]$TriCompanyRepo = 'D:\Code\ai\TriCompany',
  [string]$WorkRootOverride = ''
)

$ErrorActionPreference = 'Stop'

# ── 环境修复 R1 教训（2026-09-25 12:34 死跑）：Bash 链继承的 PSModulePath 混入 pwsh7 目录，
#    5.1 据此加载 pwsh7 版 Microsoft.PowerShell.Utility → Get-FileHash 缺失（ConvertFrom-Json 却在）。
#    处置：驱动进程内净化为 5.1 正规模块面（子进程 Invoke-Target 一并继承受益）。──
$psmpBefore = $env:PSModulePath
$env:PSModulePath = (($psmpBefore -split ';') | Where-Object {
  $_ -and ($_ -notmatch '\\PowerShell\\Modules') -and ($_ -notmatch '\\PowerShell\\7\\')
}) -join ';'
if ($env:PSModulePath -notmatch [regex]::Escape('C:\WINDOWS\system32\WindowsPowerShell\v1.0\Modules')) {
  $env:PSModulePath = 'C:\WINDOWS\system32\WindowsPowerShell\v1.0\Modules;' + $env:PSModulePath
}
if (-not (Get-Command Get-FileHash -ErrorAction SilentlyContinue)) {
  throw "环境修复失效：Get-FileHash 仍不可用——PSModulePath 净化后仍异常，中止（防全量假阴性）"
}

$WorkRoot = if ($WorkRootOverride) { $WorkRootOverride } else { Join-Path $env:TEMP ("ste-postunfreeze-" + (Get-Date -Format 'yyyyMMdd-HHmmss')) }
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

# ── 沙箱 fixture 工具（与前驱动同族）──
function New-Case([string]$name) {
  $d = Join-Path $WorkRoot $name
  New-Item -ItemType Directory -Path (Join-Path $d 'settings.presets') -Force | Out-Null
  return $d
}
function Write-Utf8NoBom([string]$path, [string]$text) {
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($path, $text, $enc)
}
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
function Invoke-Target([string]$dir, [string[]]$extraArgs) {
  Assert-SandboxPath $dir
  $argLine = " -TargetDir '$dir'"
  foreach ($a in $extraArgs) { $argLine += " $a" }
  $cmd = "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; & '$ScriptPath'$argLine; exit `$LASTEXITCODE"
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'powershell.exe'
  $psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -Command `"$cmd`""
  $psi.RedirectStandardOutput = $true; $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false; $psi.CreateNoWindow = $true
  $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
  $psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8
  $p = [System.Diagnostics.Process]::Start($psi)
  # R1 教训：顺序 ReadToEnd 有 stderr 缓冲死锁类风险 → 异步双读；60s 看门狗防悬挂（防全量超时）
  $outTask = $p.StandardOutput.ReadToEndAsync()
  $errTask = $p.StandardError.ReadToEndAsync()
  if (-not $p.WaitForExit(60000)) {
    try { $p.Kill() } catch {}
    return [pscustomobject]@{ exit = $null; out = $outTask.Result; err = ('WATCHDOG-TIMEOUT-60s: ' + $errTask.Result) }
  }
  $out = $outTask.Result; $err = $errTask.Result
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
  # R1 教训：mock 子进程不重定向输出会继承父 stdout 管道句柄 → 外层管道永不 EOF（超时假象）；
  #   处置：stdout/stderr 各落案目录文件（兼作 mock 侧证据）
  $mockOut = Join-Path $dir 'mock-listener.out.txt'
  $mockErr = Join-Path $dir 'mock-listener.err.txt'
  $proc = Start-Process powershell.exe -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',$lp,'-Port',$script:MockPort,'-Status',"$status",'-MaxReq',"$maxReq") -PassThru -WindowStyle Hidden -RedirectStandardOutput $mockOut -RedirectStandardError $mockErr
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

# ═══ 前置 ═══
if (-not (Test-Path $ScriptPath)) { throw "被测脚本不存在: $ScriptPath" }
$banner = @()
$banner += "=== STE 解冻后复验 · dev 合成形态（候 2d08d7c）==="
$banner += "被测: $ScriptPath"
$banner += "环境修复: PSModulePath 净化（剔 pwsh7 面，保 5.1 系统模块）→ Get-FileHash 可用性已断言"
$banner += "沙箱: $WorkRoot"
$banner += "活体参照（仅字符串防呆，零触）: $livePathRef"
$banner += "时点: $((Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz'))"
$banner | ForEach-Object { Write-Host $_ }

$script:MockPort = Get-FreePort

# ═══ I 身份核（合成形态三查：现役笔/同值/门除名）═══
try {
  $branch = (& git -C $TriCompanyRepo rev-parse --abbrev-ref HEAD).Trim()
  $head = (& git -C $TriCompanyRepo rev-parse --short HEAD).Trim()
  $ok = ($branch -eq 'dev') -and ($head -ieq '2d08d7c')
  Record 'I-1 dev现役笔身份' $ok ("branch={0} head={1}（期望 dev/2d08d7c）" -f $branch, $head)
} catch { Record 'I-1 dev现役笔身份' $false "driver 异常: $($_.Exception.Message)" }

try {
  $a = [System.IO.File]::ReadAllText($ScriptPath)
  $b = [System.IO.File]::ReadAllText($FixBranchScript)
  $na = $a.Replace("`r`n","`n"); $nb = $b.Replace("`r`n","`n")
  $ok = ($na -eq $nb)
  Record 'I-2 合成同值身份(vs f887b27 已验分支·EOL归一)' $ok ("content-equal={0}（R2 勘误：git archive CRLF smudge，字节差纯 EOL，归一后同值即同值）" -f $ok)
} catch { Record 'I-2 合成同值身份(vs f887b27 已验分支·EOL归一)' $false "driver 异常: $($_.Exception.Message)" }

try {
  $src = Get-Content $ScriptPath -Raw -Encoding UTF8
  $gateFree = ($src -notmatch 'exit 3')
  Record 'I-3 冻结门除名静态断言' $gateFree ("exit-3-gate-absent={0}（R2 勘误：门形=param后exit 3，现零残留；FROZEN-NOTICE 字样系 L19 档案注记，合法在文）" -f $gateFree)
} catch { Record 'I-3 冻结门除名静态断言' $false "driver 异常: $($_.Exception.Message)" }

# ═══ a) 四锚沙箱复跑（与 f887b27 复验同案同断言，被测换 dev 合成形态）═══
# 锚1 健康门三态（T1a/b/c）
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

# 锚2 同形注入（T2b）
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

# 锚3 轮换豁免哨兵（T3c）
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

# 锚4 断言失败自动回滚（T4b）
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

# ═══ b) CaptureRelay 沙箱固化演练（CTO 建议项·部署日 3333 健康窗预演）═══
# CR-1 固化: 现役形（relay 多键 env）→ relay-3333.json（7 键保真+无 BOM）
# CR-2 回切: -Mode relay 消费所固化预设 → settings.json 切回 relay 形（部署日「capture→健康窗后回切」全序）
try {
  $d = New-Case 'cr-fullflow'
  $envMap = @{ ANTHROPIC_BASE_URL='http://127.0.0.1:3333'; ANTHROPIC_AUTH_TOKEN='relay-tok-VAL'; ANTHROPIC_MODEL='glm-5.3-flash'; ANTHROPIC_DEFAULT_FABLE_MODEL='glm-5.3-flash'; ANTHROPIC_DEFAULT_FABLE_MODEL_NAME='glm-5.3-flash'; ANTHROPIC_DEFAULT_SONNET_MODEL='glm-5.3-flash'; ANTHROPIC_SMALL_FAST_MODEL='glm-5.3-flash' }
  $props = ($envMap.GetEnumerator() | ForEach-Object { "    ""$($_.Key)"": ""$($_.Value)""" }) -join ",`n"
  Write-Utf8NoBom (Join-Path $d 'settings.json') "{`n  ""env"": {`n$props`n  },`n  ""otherKey"": ""preserve-me""`n}"
  $r1 = Invoke-Target $d @('-CaptureRelay')
  $capPath = Join-Path $d 'settings.presets\relay-3333.json'
  $capOk = $false; $keyCount = 0; $bom = '<absent>'
  if (Test-Path $capPath) {
    $capEnv = (Get-Content $capPath -Raw | ConvertFrom-Json).env
    $keyCount = $capEnv.PSObject.Properties.Name.Count
    $capOk = ($keyCount -eq 7) -and ([string]$capEnv.PSObject.Properties['ANTHROPIC_AUTH_TOKEN'].Value -eq 'relay-tok-VAL') -and ([string]$capEnv.PSObject.Properties['ANTHROPIC_SMALL_FAST_MODEL'].Value -eq 'glm-5.3-flash')
    $bytes = [System.IO.File]::ReadAllBytes($capPath)
    $bom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
  }
  $ok1 = ($r1.exit -eq 0) -and ($r1.out -match 'RESULT \| op=capture-relay') -and $capOk -and (-not $bom)
  Record 'CR-1 CaptureRelay固化全流程' $ok1 ("exit={0} cap-keys={1}/7 fidelity={2} bom={3}" -f $r1.exit, $keyCount, $capOk, $bom)

  $r2 = Invoke-Target $d @('-Mode','relay')
  $postEnv = $null; $postOk = $false; $preserveOk = $false
  if (Test-Path (Join-Path $d 'settings.json')) {
    $postDoc = Get-Content (Join-Path $d 'settings.json') -Raw | ConvertFrom-Json
    $postEnv = $postDoc.env
    $postOk = ($postEnv.PSObject.Properties.Name.Count -eq 7) `
      -and ([string]$postEnv.PSObject.Properties['ANTHROPIC_AUTH_TOKEN'].Value -eq 'relay-tok-VAL') `
      -and ([string]$postEnv.PSObject.Properties['ANTHROPIC_BASE_URL'].Value -eq 'http://127.0.0.1:3333')
    $preserveOk = ([string]$postDoc.PSObject.Properties['otherKey'].Value -eq 'preserve-me')
  }
  $ok2 = ($r2.exit -eq 0) -and ($r2.out -match 'RESULT \| op=switch') -and ($r2.out -match 'assert=pass') -and $postOk -and $preserveOk
  $failLine = [regex]::Match($r2.out, 'FAIL \| code=\d+ \| msg=[^\r\n|]+').Value
  Record 'CR-2 部署日relay回切演练' $ok2 ("exit={0} env-keys={1}/7 val-match={2} otherKey-preserved={3} baks={4} fail-line={5}" -f $r2.exit, $(if ($postEnv) { $postEnv.PSObject.Properties.Name.Count } else { 0 }), $postOk, $preserveOk, (Count-Backups $d), $failLine)
} catch { Record 'CR-1/CR-2 CaptureRelay全序演练' $false "driver 异常: $($_.Exception.Message)" }

# CR-3 CaptureRelay WhatIf 干跑零写（T6b 折叠）
try {
  $d = New-Case 'cr3-whatif'
  New-LiveSettings $d 'relay-tok' '' 'http://127.0.0.1:3333'
  $capPath = Join-Path $d 'settings.presets\relay-3333.json'
  $sentinel = Get-FileHash-Safe (Join-Path $d 'settings.json')
  $r = Invoke-Target $d @('-CaptureRelay','-WhatIf')
  $ok = ($r.exit -eq 0) -and ($r.out -match 'CaptureRelay 干跑完成，零写动作') -and (-not (Test-Path $capPath)) -and ((Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel)
  Record 'CR-3 CaptureRelay WhatIf零写' $ok ("exit={0} preset-absent={1}" -f $r.exit, (-not (Test-Path $capPath)))
} catch { Record 'CR-3 CaptureRelay WhatIf零写' $false "driver 异常: $($_.Exception.Message)" }

# CR-4 relay 预设缺位 fail-closed（健康窗前置负路径，T7b 折叠）
try {
  $d = New-Case 'cr4-norelay'
  New-LiveSettings $d 'relay-tok' '' 'http://127.0.0.1:3333'
  $r = Invoke-Target $d @('-Mode','relay')
  $ok = ($r.exit -eq 2) -and ($r.out -match '预设不存在') -and ($r.out -match 'CaptureRelay')
  Record 'CR-4 relay预设缺位fail-closed' $ok ("exit={0} hint-line={1}" -f $r.exit, [bool]($r.out -match 'CaptureRelay'))
} catch { Record 'CR-4 relay预设缺位fail-closed' $false "driver 异常: $($_.Exception.Message)" }

# CR-5 CaptureRelay×InjectKey 互斥（T8 折叠）
try {
  $d = New-Case 'cr5-mutex'
  New-LiveSettings $d 'live-auth-tok' '' 'https://open.bigmodel.cn/api/anthropic'
  $sentinel = Get-FileHash-Safe (Join-Path $d 'settings.json')
  $r = Invoke-Target $d @('-CaptureRelay','-InjectKey')
  $ok = ($r.exit -eq 2) -and ($r.out -match '互斥') -and ((Get-FileHash-Safe (Join-Path $d 'settings.json')) -eq $sentinel)
  Record 'CR-5 CaptureRelay×InjectKey互斥' $ok ("exit={0}" -f $r.exit)
} catch { Record 'CR-5 CaptureRelay×InjectKey互斥' $false "driver 异常: $($_.Exception.Message)" }

# CR-6 3333 健康窗冒烟预演: 优先真 3333 口绑 mock（被占则降级自由口并注记）；capture→relay 切换+smoke 全序
try {
  $d = New-Case 'cr6-smoke3333'
  $portUsed = 0; $note = ''
  try {
    $probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 3333)
    $probe.Start(); $probe.Stop(); $portUsed = 3333; $note = '真3333口'
  } catch {
    $portUsed = Get-FreePort; $note = "3333被占用降级口$portUsed（语义等价；真3333健康窗部署日执行）"
  }
  $script:MockPort = $portUsed
  $baseUrl = "http://127.0.0.1:$portUsed"
  $ml = New-MockListener $d 200 1   # MaxReq=1: 仅 smoke 单请求
  if (-not $ml.ready) {
    Record 'CR-6 3333健康窗冒烟预演' $false "mock listener 未就绪（端口 $portUsed）——读数作废防假"
  } else {
    New-LiveSettings $d 'relay-live-tok' $null $baseUrl
    $r1 = Invoke-Target $d @('-CaptureRelay')
    $r2 = Invoke-Target $d @('-Mode','relay','-SmokeTest')
    $ok = ($r1.exit -eq 0) -and ($r2.exit -eq 0) -and ($r2.out -match 'smoke=PASS') -and ($r2.out -match 'RESULT \| op=switch')
    $failLine6 = [regex]::Match($r2.out, 'FAIL \| code=\d+ \| msg=[^\r\n|]+').Value
    Record 'CR-6 3333健康窗冒烟预演' $ok ("port=$note cap-exit={0} switch-exit={1} smoke-line={2} fail-line={3}" -f $r1.exit, $r2.exit, [bool]($r2.out -match 'smoke=PASS'), $failLine6)
  }
} catch { Record 'CR-6 3333健康窗冒烟预演' $false "driver 异常: $($_.Exception.Message)" }

# ═══ 汇总 ═══
$total = $script:PassCount + $script:FailCount
Write-Host ""
Write-Host ("=== 汇总: {0}/{1} PASS, {2} FAIL ===" -f $script:PassCount, $total, $script:FailCount) -ForegroundColor $(if ($script:FailCount -eq 0) {'Green'} else {'Red'})
Write-Host ("沙箱残留(留证): {0}" -f $WorkRoot)

$readingPath = Join-Path $WorkRoot 'ste-postunfreeze-readings.txt'
$summary = @()
$summary += "STE 解冻后复验读数 · $((Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz'))"
$summary += "被测: $ScriptPath（dev 合成形态）"
$summary += ("汇总: {0}/{1} PASS, {2} FAIL" -f $script:PassCount, $total, $script:FailCount)
$summary += ""
$summary += $script:Results
$summary | Set-Content -Path $readingPath -Encoding UTF8
Write-Host ("读数: {0}" -f $readingPath)
exit $(if ($script:FailCount -eq 0) { 0 } else { 1 })
