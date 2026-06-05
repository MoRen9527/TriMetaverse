@echo off
setlocal
powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0tmv.ps1" %*
exit /b %ERRORLEVEL%
