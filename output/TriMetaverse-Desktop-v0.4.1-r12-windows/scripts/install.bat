@echo off
setlocal
echo ========================================
echo  TriMetaverse Desktop Installer v0.4.1-r12
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
