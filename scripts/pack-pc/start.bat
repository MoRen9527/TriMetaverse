@echo off
REM Phase P0: One-click launcher for TriMetaverse PC
REM Starts TriLC, then VSCodium with TriPilot preloaded

setlocal enabledelayedexpansion

set BUNDLE_DIR=%~dp0..\..\dist\pack-pc
set TRI_LC_DIR=%BUNDLE_DIR%\tri-lc
set VSCODIUM_DIR=%BUNDLE_DIR%\vscodium
set CONFIG_DIR=%BUNDLE_DIR%\config

REM ── Allow override via environment ──
if defined TRILC_HOME set TRI_LC_DIR=%TRILC_HOME%
if defined VSCODIUM_HOME set VSCODIUM_DIR=%VSCODIUM_HOME%

echo === TriMetaverse PC Launcher (Phase P0) ===

REM ── 1. Start TriLC ──
echo.
echo [1/2] Starting TriLC...
if not exist "%TRI_LC_DIR%\dist\index.js" (
    echo ERROR: TriLC not found at %TRI_LC_DIR%\dist\index.js
    echo Run bundle.ps1 first.
    pause
    exit /b 1
)

set TRILC_PORT=8711
if exist "%CONFIG_DIR%\defaults.json" (
    REM Extract port from config (naive grep — works for Phase P0)
    for /f "tokens=2 delims=:," %%a in ('findstr /c:"\"port\"" "%CONFIG_DIR%\defaults.json"') do set TRILC_PORT=%%a
    set TRILC_PORT=!TRILC_PORT: =!
)

set TRIMC_BASE_URL=http://127.0.0.1:8710
set PORT=%TRILC_PORT%

start "TriLC" /MIN cmd /c "cd /d %TRI_LC_DIR% && node dist\index.js"
echo   TriLC starting on port %TRILC_PORT%...

REM ── Wait for TriLC health check ──
echo   Waiting for TriLC to become healthy...
set /a RETRIES=0
:wait_health
timeout /t 1 /nobreak >nul
curl -s http://127.0.0.1:%TRILC_PORT%/healthz >nul 2>&1
if %errorlevel% equ 0 goto health_ok
set /a RETRIES+=1
if %RETRIES% lss 10 goto wait_health
echo   WARNING: TriLC did not respond after 10s — starting VSCodium anyway.

:health_ok
echo   TriLC healthy.

REM ── 2. Start VSCodium ──
echo.
echo [2/2] Starting VSCodium...
if not exist "%VSCODIUM_DIR%\bin\codium.exe" (
    echo ERROR: VSCodium not found at %VSCODIUM_DIR%\bin\codium.exe
    echo Download it manually or run bundle.ps1.
    pause
    exit /b 1
)

set VSCODIUM_EXT_DIR=%VSCODIUM_DIR%\extensions
set VSCODIUM_DATA_DIR=%VSCODIUM_DIR%\data

start "VSCodium" "%VSCODIUM_DIR%\bin\codium.exe" ^
    --extensions-dir "%VSCODIUM_EXT_DIR%" ^
    --user-data-dir "%VSCODIUM_DATA_DIR%"

echo.
echo === TriMetaverse PC started ===
echo   TriLC:  http://127.0.0.1:%TRILC_PORT%
echo   TriMC:  %TRIMC_BASE_URL% (proxy)
echo.
echo Close VSCodium first, then this window to stop TriLC.
pause
