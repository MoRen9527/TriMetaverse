# Phase P0: Zero-packaging bundle assembler
# Assembles TriLC + TriPilot + VSCodium portable into dist/pack-pc/
param(
  [string]$OutputDir = "$PSScriptRoot\..\..\dist\pack-pc",
  [string]$TriLCSrc = "$PSScriptRoot\..\..\..\TriLC",
  [string]$TriPilotSrc = "$PSScriptRoot\..\..\..\TriPilot",
  [string]$VSCodiumVersion = "1.98.2.25072"
)

$ErrorActionPreference = "Stop"

Write-Host "=== TriMetaverse PC Bundle (Phase P0) ===" -ForegroundColor Cyan

# ── Resolve absolute paths ──
$OutputDir = [System.IO.Path]::GetFullPath($OutputDir)
$TriLCSrc  = [System.IO.Path]::GetFullPath($TriLCSrc)
$TriPilotSrc = [System.IO.Path]::GetFullPath($TriPilotSrc)

Write-Host "Output: $OutputDir"
Write-Host "TriLC:   $TriLCSrc"
Write-Host "TriPilot: $TriPilotSrc"

# ── Step 1: Create output structure ──
$dirs = @(
  "$OutputDir\tri-lc",
  "$OutputDir\tri-lc\dist",
  "$OutputDir\tri-lc\node_modules\@trimetaverse",
  "$OutputDir\tri-lc\node_modules\trimodel",
  "$OutputDir\vscodium\extensions\tripilot",
  "$OutputDir\config"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path $d | Out-Null }

# ── Step 2: Build and copy TriLC ──
Write-Host "`n[1/4] Building TriLC..." -ForegroundColor Yellow
Push-Location $TriLCSrc
npm run build 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) { throw "TriLC build failed" }
Pop-Location

Write-Host "  Copying TriLC dist..."
Copy-Item -Recurse "$TriLCSrc\dist\*" "$OutputDir\tri-lc\dist\"

Write-Host "  Copying TriLC package.json..."
Copy-Item "$TriLCSrc\package.json" "$OutputDir\tri-lc\package.json"

Write-Host "  Copying TriLC node_modules (agent-core + trimodel)..."
if (Test-Path "$TriLCSrc\node_modules\@trimetaverse\agent-core") {
  Copy-Item -Recurse "$TriLCSrc\node_modules\@trimetaverse\agent-core" "$OutputDir\tri-lc\node_modules\@trimetaverse\agent-core"
}
if (Test-Path "$TriLCSrc\node_modules\trimodel") {
  Copy-Item -Recurse "$TriLCSrc\node_modules\trimodel" "$OutputDir\tri-lc\node_modules\trimodel"
}

# ── Step 3: Install TriPilot extension ──
Write-Host "`n[2/4] Installing TriPilot extension..." -ForegroundColor Yellow
& "$PSScriptRoot\install-extensions.ps1" -OutputDir $OutputDir -TriPilotSrc $TriPilotSrc

# ── Step 4: Download VSCodium portable (Windows) ──
Write-Host "`n[3/4] Checking VSCodium portable..." -ForegroundColor Yellow
$codiumZip = "$OutputDir\vscodium-portable.zip"
$codiumUrl = "https://github.com/VSCodium/vscodium/releases/download/$VSCodiumVersion/VSCodium-win32-x64-$VSCodiumVersion.zip"

if (-not (Test-Path "$OutputDir\vscodium\bin\codium.exe")) {
  Write-Host "  Downloading VSCodium $VSCodiumVersion..."
  try {
    Invoke-WebRequest -Uri $codiumUrl -OutFile $codiumZip -UseBasicParsing
    Write-Host "  Extracting..."
    Expand-Archive -Path $codiumZip -DestinationPath "$OutputDir\vscodium" -Force
    Remove-Item $codiumZip
  } catch {
    Write-Warning "  Download failed: $_"
    Write-Warning "  Please install VSCodium manually and set VSCODIUM_HOME in start.bat"
  }
} else {
  Write-Host "  VSCodium already present, skipping download."
}

# ── Step 5: Write default config ──
Write-Host "`n[4/4] Writing default config..." -ForegroundColor Yellow
$config = @{
  trimcBaseUrl = "http://127.0.0.1:8710"
  port = 8711
  simplifiedMode = $true
  logLevel = "info"
}
$config | ConvertTo-Json -Depth 2 | Out-File -FilePath "$OutputDir\config\defaults.json" -Encoding utf8

# ── Done ──
Write-Host "`n=== Bundle assembled at: $OutputDir ===" -ForegroundColor Green
Write-Host "Run start.bat to launch." -ForegroundColor Green
