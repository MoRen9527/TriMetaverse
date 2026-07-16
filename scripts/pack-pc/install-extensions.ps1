# Phase P0: Install TriPilot extension into VSCodium extensions directory
param(
  [string]$OutputDir,
  [string]$TriPilotSrc
)

$ErrorActionPreference = "Stop"

$extDir = "$OutputDir\vscodium\extensions\tripilot"
New-Item -ItemType Directory -Force -Path $extDir | Out-Null

Write-Host "  Installing TriPilot to: $extDir"

# ── Copy TriPilot compiled output ──
$pilotDirs = @("out", "resources", "media")
foreach ($d in $pilotDirs) {
  $srcPath = "$TriPilotSrc\$d"
  if (Test-Path $srcPath) {
    Copy-Item -Recurse $srcPath "$extDir\" -Force
    Write-Host "    Copied $d/"
  } else {
    Write-Warning "    $d/ not found in TriPilot source"
  }
}

# ── Copy package.json (extension manifest) ──
Copy-Item "$TriPilotSrc\package.json" "$extDir\package.json"

# ── Install TriPilot node_modules (production only) ──
Write-Host "  Installing TriPilot dependencies..."
Push-Location $extDir
npm install --omit=dev --no-audit --no-fund 2>&1 | Out-Host
Pop-Location

Write-Host "  TriPilot extension installed."
