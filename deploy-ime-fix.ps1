# Deploy the IME (isComposing) fix to the INSTALLED TriCade app.
# Source = repo v0.2.0 output (byte-identical to installed + the new guard).
# Target = C:\Program Files\TriCade\...\tripilot-chat\media\main.js  (needs admin)
# Run elevated. Idempotent + self-verifying. Status written to .ime-deploy-status.txt
$ErrorActionPreference = 'Stop'
$src = 'D:\Code\ai\TriMetaverse\output\TriMetaverse-Desktop-v0.2.0-windows\extensions\tripilot-chat-0.0.1\extension\media\main.js'
$dst = 'C:\Program Files\TriCade\resources\app\extensions\tripilot-chat\media\main.js'
$status = 'D:\Code\ai\TriMetaverse\.ime-deploy-status.txt'
$utf8 = New-Object System.Text.UTF8Encoding $false
function Set-Status($m) { [System.IO.File]::WriteAllText($status, $m, $utf8) }
try {
  if (-not (Test-Path $src)) { Set-Status "ERR source-not-found: $src"; exit 1 }
  $t = [System.IO.File]::ReadAllText($src)
  if (-not $t.Contains('isComposing')) { Set-Status 'ERR source-missing-guard (refusing to deploy)'; exit 1 }
  [System.IO.File]::Copy($src, $dst, $true)
  $v = [System.IO.File]::ReadAllText($dst)
  if ($v.Contains('isComposing')) { Set-Status 'OK deployed' } else { Set-Status 'ERR verify-failed' }
} catch {
  Set-Status ("ERR " + $_.Exception.Message)
}
