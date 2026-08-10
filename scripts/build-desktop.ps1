# build-desktop.ps1 — TriMetaverse Desktop Windows 分发组装脚本
# CTO-008-P P.5: 构建流水线
# 产出: output/TriMetaverse-Desktop-v0.1.0-windows.zip

param(
    [string]$Platform = "windows",
    [string]$Version = "v0.1.0",
    [string]$OutputDir = "output",
    [switch]$SkipDownload = $false
)

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TriMetaverse Desktop Build Pipeline    " -ForegroundColor Cyan
Write-Host " Platform: $Platform   Version: $Version" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ── helpers ──

function Step { Write-Host "`n>>> $args" -ForegroundColor Yellow }
function Ok   { Write-Host "  OK" -ForegroundColor Green }

# ── Paths (sibling repos) ──

$TriCodePath  = Join-Path $RootDir "..\TriCode"
$TriLCPath    = Join-Path $RootDir "..\TriLC"
$TriPilotPath = Join-Path $RootDir "..\TriPilot"
$OutputFull   = Join-Path $RootDir $OutputDir
$StagingDir   = Join-Path $OutputFull "TriMetaverse-Desktop-$Version-$Platform"
$ZipFile      = Join-Path $OutputFull "TriMetaverse-Desktop-$Version-$Platform.zip"

# ── 1. Build TriCode ──

Step "Building TriCode"
Push-Location $TriCodePath
try {
    & npm install --silent 2>&1 | Out-Null
    & npx tsc -p tsconfig.json --outDir dist
    Ok
} finally { Pop-Location }

# ── 2. Build TriLC ──

Step "Building TriLC"
Push-Location $TriLCPath
try {
    & npm install --silent 2>&1 | Out-Null
    & npx tsc -p tsconfig.json --outDir dist
    npm ls --depth=0 2>&1 | Out-Null
    Ok
} finally { Pop-Location }

# ── 3. Build TriPilot (with TriCode link) ──

Step "Building TriPilot"
Push-Location $TriPilotPath
try {
    & npm install --silent 2>&1 | Out-Null
    & npx tsc -p tsconfig.json --outDir out
    Ok
} finally { Pop-Location }

# ── 4. Package TriPilot .vsix ──

Step "Packaging TriPilot .vsix"
Push-Location $TriPilotPath
try {
    $vsceVer = & npx vsce --version 2>&1
    Write-Host "  vsce: $vsceVer"
    & npx vsce package --no-dependencies --allow-missing-repository 2>&1
    $VsixFile = Get-ChildItem *.vsix | Select-Object -First 1
    Write-Host "  .vsix: $($VsixFile.Name)"
    Ok
} finally { Pop-Location }

# ── 5. Prepare staging directory ──

Step "Preparing staging: $StagingDir"
Remove-Item -Recurse -Force $StagingDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $StagingDir\extensions  | Out-Null
New-Item -ItemType Directory -Force -Path $StagingDir\trilc       | Out-Null
New-Item -ItemType Directory -Force -Path $StagingDir\tri-code    | Out-Null
New-Item -ItemType Directory -Force -Path $StagingDir\config      | Out-Null
New-Item -ItemType Directory -Force -Path $StagingDir\scripts     | Out-Null
Ok

# ── 6. Assemble TriLC ──

Step "Assembling TriLC → staging/trilc/"
Copy-Item -Recurse -Force $TriLCPath\dist         $StagingDir\trilc\
Copy-Item -Recurse -Force $TriLCPath\node_modules $StagingDir\trilc\ -ErrorAction SilentlyContinue
Copy-Item -Force       $TriLCPath\package.json    $StagingDir\trilc\
# F1-fix: generate version.json so TRILC_VERSION reads correctly at runtime
$VersionJson = @{ version = "1.0.0" } | ConvertTo-Json -Compress
Set-Content -Path (Join-Path $StagingDir "trilc\version.json") -Value $VersionJson -Encoding UTF8
Ok

# ── 7. Assemble TriCode ──

Step "Assembling TriCode → staging/tri-code/"
Copy-Item -Recurse -Force $TriCodePath\dist         $StagingDir\tri-code\
Copy-Item -Recurse -Force $TriCodePath\node_modules $StagingDir\tri-code\ -ErrorAction SilentlyContinue
Copy-Item -Force       $TriCodePath\package.json    $StagingDir\tri-code\
Ok

# ── 8. Extract TriPilot .vsix → staging/extensions/ ──

Step "Extracting TriPilot .vsix → staging/extensions/"
$ExtDir = Join-Path $StagingDir "extensions\tripilot-chat-0.0.1"
New-Item -ItemType Directory -Force -Path $ExtDir | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($VsixFile.FullName, $ExtDir)
Ok

# ── 9. Preconfigured settings ──

Step "Copying preconfigured settings"
Copy-Item -Force (Join-Path $RootDir "config\settings.json") $StagingDir\config\
Ok

# ── 10. Install scripts ──

Step "Creating install scripts"
$InstallBat = @'
@echo off
setlocal
echo ========================================
echo  TriMetaverse Desktop Installer %VERSION%
echo ========================================
echo.

:: Check VSCodium
set VSCODIUM_PORTABLE=%CD%\VSCodium
if not exist "%VSCODIUM_PORTABLE%\VSCodium.exe" (
    echo [ERROR] VSCodium portable not found at %VSCODIUM_PORTABLE%
    echo Download from: https://github.com/VSCodium/vscodium/releases
    pause
    exit /b 1
)

:: Install extension
echo [1/3] Installing TriPilot extension...
"%VSCODIUM_PORTABLE%\VSCodium.exe" --install-extension ".\extensions\tripilot-chat-0.0.1" --force

:: Inject settings
echo [2/3] Configuring TriPilot defaults...
if not exist "%APPDATA%\VSCodium\User" mkdir "%APPDATA%\VSCodium\User"
copy /Y ".\config\settings.json" "%APPDATA%\VSCodium\User\settings.json"

:: Done
echo [3/3] Installation complete!
echo.
echo Starting TriMetaverse Desktop...
start "" "%VSCODIUM_PORTABLE%\VSCodium.exe"
endlocal
'@ -replace '%VERSION%', $Version

Set-Content -Path (Join-Path $StagingDir "scripts\install.bat") -Value $InstallBat -Encoding ASCII

$StartBat = @'
@echo off
start "" ".\VSCodium\VSCodium.exe"
'@
Set-Content -Path (Join-Path $StagingDir "scripts\start.bat") -Value $StartBat -Encoding ASCII
Ok

# ── 11. Package .zip ──

Step "Creating distributable ZIP"
Remove-Item -Force $ZipFile -ErrorAction SilentlyContinue
Compress-Archive -Force -Path $StagingDir\* -DestinationPath $ZipFile
Write-Host "  $ZipFile" -ForegroundColor Green
Ok

# ── Done ──

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Build complete!" -ForegroundColor Green
Write-Host " Output: $ZipFile" -ForegroundColor Green
Write-Host " Staging: $StagingDir" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
