@echo off
setlocal
cd /d "%~dp0"
echo Starting STM32 learning site...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\serve.ps1"
if errorlevel 1 (
  echo.
  echo Startup failed. Review the error message above.
  pause
  exit /b 1
)
