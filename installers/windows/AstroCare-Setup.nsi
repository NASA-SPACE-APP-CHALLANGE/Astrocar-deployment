; AstroCare Windows NSIS Installer Specification
; Product: AstroCare v2.0.0
; Architecture: x64 Windows

!include "MUI2.nsh"
!include "FileFunc.nsh"

; General Settings
Name "AstroCare"
OutFile "/home/ark123/Downloads/AstroCare-main/installers/windows/AstroCare-2.0.0-Setup.exe"
InstallDir "$PROGRAMFILES64\AstroCare"
InstallDirRegKey HKLM "Software\AstroCare" "Install_Dir"
RequestExecutionLevel admin

; UI Configuration
!define MUI_ABORTWARNING
!define MUI_ICON "/home/ark123/Downloads/AstroCare-main/frontend/public/favicon.svg"
!define MUI_UNICON "/home/ark123/Downloads/AstroCare-main/frontend/public/favicon.svg"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "/home/ark123/Downloads/AstroCare-main/LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\AstroCare.bat"
!define MUI_FINISHPAGE_RUN_TEXT "Launch AstroCare Mission Console now"
!insertmacro MUI_PAGE_FINISH

; Uninstaller Pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

; Installer Section
Section "AstroCare Core" SecCore
  SetOutPath "$INSTDIR"
  File /r "/home/ark123/Downloads/AstroCare-main/installers/windows/AstroCare-Windows-Portable\*.*"
  
  ; Write Registry Keys for Add/Remove Programs
  WriteRegStr HKLM "Software\AstroCare" "Install_Dir" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AstroCare" "DisplayName" "AstroCare - Astronaut Health Monitoring"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AstroCare" "DisplayVersion" "2.0.0"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AstroCare" "Publisher" "NASA Space Apps Challenge Team"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AstroCare" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AstroCare" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AstroCare" "NoRepair" 1

  ; Write Uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; Create Start Menu Shortcuts
  CreateDirectory "$SMPROGRAMS\AstroCare"
  CreateShortcut "$SMPROGRAMS\AstroCare\AstroCare Mission Console.lnk" "$INSTDIR\AstroCare.bat" "" "$INSTDIR\app\frontend\dist\favicon.ico" 0
  CreateShortcut "$SMPROGRAMS\AstroCare\Uninstall AstroCare.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\Uninstall.exe" 0

  ; Create Desktop Shortcut
  CreateShortcut "$DESKTOP\AstroCare.lnk" "$INSTDIR\AstroCare.bat" "" "$INSTDIR\app\frontend\dist\favicon.ico" 0
SectionEnd

; Uninstaller Section
Section "Uninstall"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AstroCare"
  DeleteRegKey HKLM "Software\AstroCare"

  ; Remove shortcuts
  Delete "$DESKTOP\AstroCare.lnk"
  Delete "$SMPROGRAMS\AstroCare\*.*"
  RMDir "$SMPROGRAMS\AstroCare"

  ; Remove files
  RMDir /r "$INSTDIR"
SectionEnd
