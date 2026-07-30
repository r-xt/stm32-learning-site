@echo off
setlocal
cd /d "%~dp0"
echo Building and checking the offline site...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build.ps1"
if errorlevel 1 (
  echo.
  echo Build failed. Review the error message above.
  pause
  exit /b 1
) else (
  echo.
  echo Build completed. Open site\index.html or use the archive in dist.
  pause
)
