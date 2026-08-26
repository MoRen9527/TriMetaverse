<#
.SYNOPSIS
  FADE 管线本地监控（fade-pipeline-design.md v1.0 §三）——轮询 sg-bare 树状态直到终态。

.DESCRIPTION
  用法:
    .\fade-watch.ps1 -TreeId fade-rehearsal-001                # 持续监控（默认 60s 间隔 / 240min 超时）
    .\fade-watch.ps1 -TreeId <id> -Once                        # 单查一次（可挂 trilc cron）
    .\fade-watch.ps1 -TreeId <id> -IntervalSec 120 -TimeoutMin 480
  退出码: 0=done（终态）| 1=超时 | 2=blocked | 3=frozen/其他终态 | 4=树不存在 | 5=-Once 观测到非终态
  留痕: .fade\watch-<TreeId>.json（最后一次观测快照）+ .fade\watch-<TreeId>.log（append-only 全程变化史，P2-3）
  状态落盘 .fade\watch-<TreeId>.json（最后一次观测，供会话恢复用）
#>
param(
  [Parameter(Mandatory = $true)][string]$TreeId,
  [int]$IntervalSec = 60,
  [int]$TimeoutMin = 240,
  [switch]$Once
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path "$PSScriptRoot\..\..").Path
Set-Location $repoRoot

function Get-TreeState {
  # 在 sg-server/dev 远端引用下定位树文件（不污染工作树）
  $matches = git ls-tree -r --name-only sg-server/dev -- docs/workflow/operating-records 2>$null |
    Select-String -SimpleMatch "trees/$TreeId/tree-op.json"
  if (-not $matches) { return $null }
  $path = "$($matches[0])"
  $raw = git show "sg-server/dev:$path" 2>$null
  if (-not $raw) { return $null }
  try { $j = $raw -join "`n" | ConvertFrom-Json } catch { return $null }
  $nodes = @($j.nodes | ForEach-Object { "{0}={1}" -f $_.nodeId, $_.status })
  [pscustomobject]@{
    Path     = $path
    Status   = $j.status
    Nodes    = ($nodes -join ' ')
    Done     = ($nodes | Where-Object { $_ -notmatch '=(done)$' }).Count -eq 0
  }
}

$deadline = (Get-Date).AddMinutes($TimeoutMin)
$lastLine = ''
$stateDir = Join-Path $repoRoot '.fade'
if (-not (Test-Path $stateDir)) { New-Item -ItemType Directory $stateDir | Out-Null }
$watchLog = Join-Path $stateDir "watch-$TreeId.log"

function Write-Change {
  param([string]$Line)
  Write-Host $Line
  Add-Content -Path $watchLog -Value $Line -Encoding utf8
}

while ($true) {
  git fetch sg-server dev --quiet 2>$null
  $st = Get-TreeState
  $now = (Get-Date).ToString('HH:mm:ss')
  if (-not $st) {
    Write-Change "[$now] 树 $TreeId 在 sg-server/dev 上未找到（可能尚未推送）"
    if ($Once) { exit 4 }
  } else {
    $line = "status={0} | {1}" -f $st.Status, $st.Nodes
    $st | ConvertTo-Json | Set-Content (Join-Path $stateDir "watch-$TreeId.json") -Encoding utf8
    if ($line -ne $lastLine) {
      Write-Change "[$now] $TreeId $line"
      $lastLine = $line
    }
    if ($st.Status -in @('done', 'blocked', 'frozen')) {
      Write-Change "[$now] 终态: $($st.Status)——监控结束"
      if ($st.Status -eq 'done') { exit 0 } elseif ($st.Status -eq 'blocked') { exit 2 } else { exit 3 }
    }
  }
  if ($Once) { exit 5 }  # P2-3：非终态观测与 done 区分（挂 cron 可据退出码触发终报）
  if ((Get-Date) -gt $deadline) {
    Write-Host "[$now] 超时（${TimeoutMin}min）——树未达终态，最新: $lastLine"
    exit 1
  }
  Start-Sleep -Seconds $IntervalSec
}
