/**
 * AstroCare Windows Packaging Script
 * Generates:
 * 1. NSIS Windows Installer Specification: installers/windows/AstroCare-Setup.nsi
 * 2. Windows Portable Package: installers/windows/AstroCare-2.0.0-Windows-Portable.zip
 * 3. Windows Automated Installer Build Runner: installers/windows/build-installer.bat
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'installers', 'windows');
const stagingDir = path.join(outDir, 'AstroCare-Windows-Portable');

console.log('🪟 [AstroCare Packaging] Starting Windows packaging pipeline...');

// Ensure output directory exists
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

// Step 1: Ensure frontend is built
const distDir = path.join(rootDir, 'frontend', 'dist');
if (!fs.existsSync(distDir) || fs.readdirSync(distDir).length === 0) {
  console.log('📦 Step 1: Building production frontend assets...');
  execSync('npm run --prefix frontend build', { stdio: 'inherit', cwd: rootDir });
} else {
  console.log('✅ Step 1: Production frontend build detected.');
}

// Step 2: Stage application files for Windows bundle
console.log('📂 Step 2: Staging Windows application payload...');
const appDir = path.join(stagingDir, 'app');
fs.mkdirSync(appDir, { recursive: true });

fs.cpSync(path.join(rootDir, 'frontend', 'dist'), path.join(appDir, 'frontend', 'dist'), { recursive: true });
fs.cpSync(path.join(rootDir, 'backend'), path.join(appDir, 'backend'), { recursive: true });
fs.cpSync(path.join(rootDir, 'database'), path.join(appDir, 'database'), { recursive: true });
fs.cpSync(path.join(rootDir, 'desktop'), path.join(appDir, 'desktop'), { recursive: true });
fs.cpSync(path.join(rootDir, 'package.json'), path.join(appDir, 'package.json'));

// Create Windows Batch Launchers
console.log('📝 Step 3: Generating Windows launchers and batch runners...');

// AstroCare.bat - Portable Web/Headless Mode Launcher
const batContent = `@echo off
title AstroCare - Astronaut Health Monitoring System v2.0.0
cls
echo =====================================================================
echo    ASTROCARE - ASTRONAUT HEALTH MONITORING & RISK MANAGEMENT SYSTEM
echo    NASA Space Apps Challenge - Flight Telemetry Station v2.0.0
echo =====================================================================
echo.
echo Initializing local telemetry telemetry backend on http://127.0.0.1:8000 ...
cd /d "%~dp0app"
start "AstroCare Core Server" /min cmd /c "node backend\\server.cjs"
timeout /t 2 /nobreak >nul
echo Launching AstroCare Mission Dashboard in browser...
start http://127.0.0.1:8000
echo.
echo =====================================================================
echo AstroCare is running.
echo To terminate the mission telemetry server, close this window or press Ctrl+C.
echo =====================================================================
pause
`;
fs.writeFileSync(path.join(stagingDir, 'AstroCare.bat'), batContent, 'utf8');

// AstroCare-Desktop.bat - Electron Desktop Mode Launcher
const desktopBatContent = `@echo off
title AstroCare Desktop App
cls
cd /d "%~dp0app"
echo Launching AstroCare Native Desktop Client...
npx electron desktop\\main.cjs
`;
fs.writeFileSync(path.join(stagingDir, 'AstroCare-Desktop.bat'), desktopBatContent, 'utf8');

// Step 4: Generate NSIS Installer Script
console.log('📄 Step 4: Generating NSIS Setup Wizard Script (AstroCare-Setup.nsi)...');
const nsiContent = `; AstroCare Windows NSIS Installer Specification
; Product: AstroCare v2.0.0
; Architecture: x64 Windows

!include "MUI2.nsh"
!include "FileFunc.nsh"

; General Settings
Name "AstroCare"
OutFile "${path.join(outDir, 'AstroCare-2.0.0-Setup.exe').replace(/\\/g, '/')}"
InstallDir "$PROGRAMFILES64\\AstroCare"
InstallDirRegKey HKLM "Software\\AstroCare" "Install_Dir"
RequestExecutionLevel admin

; UI Configuration
!define MUI_ABORTWARNING
!define MUI_ICON "${path.join(rootDir, 'frontend', 'public', 'favicon.svg').replace(/\\/g, '/')}"
!define MUI_UNICON "${path.join(rootDir, 'frontend', 'public', 'favicon.svg').replace(/\\/g, '/')}"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "${path.join(rootDir, 'LICENSE').replace(/\\/g, '/')}"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\\AstroCare.bat"
!define MUI_FINISHPAGE_RUN_TEXT "Launch AstroCare Mission Console now"
!insertmacro MUI_PAGE_FINISH

; Uninstaller Pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

; Installer Section
Section "AstroCare Core" SecCore
  SetOutPath "$INSTDIR"
  File /r "${stagingDir.replace(/\\/g, '/')}\\*.*"
  
  ; Write Registry Keys for Add/Remove Programs
  WriteRegStr HKLM "Software\\AstroCare" "Install_Dir" "$INSTDIR"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AstroCare" "DisplayName" "AstroCare - Astronaut Health Monitoring"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AstroCare" "DisplayVersion" "2.0.0"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AstroCare" "Publisher" "NASA Space Apps Challenge Team"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AstroCare" "UninstallString" '"$INSTDIR\\Uninstall.exe"'
  WriteRegDWORD HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AstroCare" "NoModify" 1
  WriteRegDWORD HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AstroCare" "NoRepair" 1

  ; Write Uninstaller
  WriteUninstaller "$INSTDIR\\Uninstall.exe"

  ; Create Start Menu Shortcuts
  CreateDirectory "$SMPROGRAMS\\AstroCare"
  CreateShortcut "$SMPROGRAMS\\AstroCare\\AstroCare Mission Console.lnk" "$INSTDIR\\AstroCare.bat" "" "$INSTDIR\\app\\frontend\\dist\\favicon.ico" 0
  CreateShortcut "$SMPROGRAMS\\AstroCare\\Uninstall AstroCare.lnk" "$INSTDIR\\Uninstall.exe" "" "$INSTDIR\\Uninstall.exe" 0

  ; Create Desktop Shortcut
  CreateShortcut "$DESKTOP\\AstroCare.lnk" "$INSTDIR\\AstroCare.bat" "" "$INSTDIR\\app\\frontend\\dist\\favicon.ico" 0
SectionEnd

; Uninstaller Section
Section "Uninstall"
  DeleteRegKey HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\AstroCare"
  DeleteRegKey HKLM "Software\\AstroCare"

  ; Remove shortcuts
  Delete "$DESKTOP\\AstroCare.lnk"
  Delete "$SMPROGRAMS\\AstroCare\\*.*"
  RMDir "$SMPROGRAMS\\AstroCare"

  ; Remove files
  RMDir /r "$INSTDIR"
SectionEnd
`;
fs.writeFileSync(path.join(outDir, 'AstroCare-Setup.nsi'), nsiContent, 'utf8');

// Build script for NSIS when makensis is installed
const buildBatContent = `@echo off
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
`;
fs.writeFileSync(path.join(outDir, 'build-installer.bat'), buildBatContent, 'utf8');

// Step 5: Compress into portable zip bundle
console.log('🗜️ Step 5: Packaging AstroCare-2.0.0-Windows-Portable.zip...');
const zipBaseName = path.join(outDir, 'AstroCare-2.0.0-Windows-Portable');
const zipOutputPath = `${zipBaseName}.zip`;
if (fs.existsSync(zipOutputPath)) fs.unlinkSync(zipOutputPath);

execSync(`python3 -c "import shutil, sys; shutil.make_archive(sys.argv[1], 'zip', sys.argv[2])" "${zipBaseName}" "${stagingDir}"`, {
  stdio: 'inherit',
  cwd: rootDir
});

console.log(`✅ Windows Portable Package created: ${zipOutputPath}`);
console.log(`✅ NSIS Installer Specification created: ${path.join(outDir, 'AstroCare-Setup.nsi')}`);

console.log('\n======================================================');
console.log('🎉 Windows Packaging Pipeline Complete!');
console.log(`  1. Portable ZIP: ${zipOutputPath}`);
console.log(`  2. NSIS Script:  ${path.join(outDir, 'AstroCare-Setup.nsi')}`);
console.log('======================================================\n');
