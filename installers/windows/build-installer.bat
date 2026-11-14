@echo off
echo Building AstroCare Windows Setup using NSIS...
where makensis >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] NSIS (makensis) is not installed or not in PATH.
    echo Please install NSIS from https://nsis.sourceforge.io/ and rerun this script.
    exit /b 1
)
makensis AstroCare-Setup.nsi
echo Setup build complete: AstroCare-2.0.0-Setup.exe
pause
