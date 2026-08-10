# Deploy trilc WITH CC ink fork to installed TriCade app (needs admin).
# Copies: dist/tui/* + dist/cli.js + fork engine (src/tui/ink → dist/tui/ink).
# Status -> .trilc-ime-deploy-status.txt
$ErrorActionPreference = 'Stop'
$baseSrc = 'D:\Code\ai\TriLC'
$baseDst = 'C:\Program Files\TriCade\resources\app\tools\trilc'
$status = 'D:\Code\ai\TriMetaverse\.trilc-ime-deploy-status.txt'
$utf8 = New-Object System.Text.UTF8Encoding $false
function Set-Status($m) { [System.IO.File]::WriteAllText($status, $m, $utf8) }

function Copy-Tree($srcDir, $dstDir) {
  Get-ChildItem -Path $srcDir -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($srcDir.Length + 1)
    $d = Join-Path $dstDir $rel
    $dDir = Split-Path $d -Parent
    if (-not (Test-Path $dDir)) { [void](New-Item -ItemType Directory -Path $dDir -Force) }
    [System.IO.File]::Copy($_.FullName, $d, $true)
  }
}

try {
  # remove old stock-ink leftovers
  if (Test-Path "$baseDst\dist\vendor") { Remove-Item -Recurse -Force "$baseDst\dist\vendor" }
  if (Test-Path "$baseDst\dist\src") { Remove-Item -Recurse -Force "$baseDst\dist\src" }

  # trilc code (dist/tui/*) + fork barrel (fork.tsx)
  Copy-Tree "$baseSrc\dist\tui" "$baseDst\dist\tui"
  # fork engine (src/tui/ink/* — compiled .js, not compiled by main tsc)
  Copy-Tree "$baseSrc\src\tui\ink" "$baseDst\dist\tui\ink"
  # CLI entry
  [System.IO.File]::Copy("$baseSrc\dist\cli.js", "$baseDst\dist\cli.js", $true)

  # sync fork npm deps (TriLC has them; installed app may not)
  # NOTE: Join-Path with 3 args only works in PowerShell 6+. Use nested Join-Path for 5.1 compat.
  $nmSrc = Join-Path $baseSrc 'node_modules'
  $nmDst = Join-Path $baseDst 'node_modules'
  foreach ($pkg in @('auto-bind','signal-exit','bidi-js','code-excerpt','figures',
    'stack-utils','yoga-layout-prebuilt','lodash-es','react-reconciler','react','scheduler')) {
    $sp = Join-Path $nmSrc $pkg
    $dp = Join-Path $nmDst $pkg
    if (Test-Path $sp) { Copy-Tree $sp $dp }
  }

  # verify: fork barrel has Box.js reference + engine root.js exists
  $f = [System.IO.File]::ReadAllText("$baseDst\dist\tui\fork.js")
  $ok = $f.Contains('Box.js') -and (Test-Path "$baseDst\dist\tui\ink\ink\root.js") -and (Test-Path "$baseDst\dist\cli.js")

  if ($ok) { Set-Status 'OK deployed (A: fork)' }
  else { Set-Status 'ERR verify-failed' }
} catch {
  Set-Status ("ERR " + $_.Exception.Message)
}
