# 📦 AstroCare Installation & Deployment Guide

> **AstroCare: Astronaut Health Monitoring & Risk Management System**  
> NASA Space Apps Challenge — Cross-Platform Deployment Guide (v2.0.0)

---

## 🚀 Quick Launch (Web / Local Development)

If you have Node.js (v18+) installed, you can launch AstroCare immediately without installing platform packages:

```bash
# Clone the repository
git clone https://github.com/AlgoX-NASA/AstroCare.git
cd AstroCare

# Install frontend dependencies
npm run --prefix frontend install

# Launch Mission Console (starts backend + frontend with auto-reload)
npm run dev
```
Navigate to `http://localhost:5173` (development) or `http://localhost:8000` (production core).

---

## 🐧 Linux Installation

AstroCare provides both a native Debian package (`.deb`) for Debian/Ubuntu distributions and an architecture-independent portable archive.

### Option A: Native Debian Package (`.deb`)
The `.deb` package installs AstroCare to `/opt/astrocare`, adds a system-wide launcher to `/usr/bin/astrocare`, and registers the application in your desktop application menu.

1. **Install the package:**
   ```bash
   sudo dpkg -i installers/linux/astrocare_2.0.0_amd64.deb
   ```
2. **Resolve any missing dependencies (if required):**
   ```bash
   sudo apt-get install -f
   ```
3. **Launch the application:**
   - From your application launcher: Search for **AstroCare**.
   - From any terminal:
     ```bash
     astrocare
     ```

### Option B: Portable Linux Archive (`.tar.gz`)
No root privileges required:
1. **Extract the archive:**
   ```bash
   tar -xzf installers/linux/AstroCare-2.0.0-Linux-Portable.tar.gz
   cd AstroCare-Linux-Portable
   ```
2. **Execute the launcher:**
   ```bash
   ./AstroCare.sh
   ```

### Linux Uninstallation
To remove the Debian package:
```bash
sudo dpkg -r astrocare
```

---

## 🪟 Windows Installation

AstroCare supports Windows 10/11 (64-bit) through a setup installer or a standalone portable folder.

### Option A: Windows Portable Bundle (Recommended)
1. Extract `installers/windows/AstroCare-2.0.0-Windows-Portable.zip`.
2. Double-click `AstroCare.bat` to launch the local mission telemetry core and automatically open the dashboard in your default web browser.
3. *(Optional Desktop Shell)* If Electron is installed, launch `AstroCare-Desktop.bat` to start in native windowed desktop mode.

### Option B: Compiling the NSIS Setup Installer
If you have **NSIS (Nullsoft Scriptable Install System)** installed:
1. Open a Command Prompt or PowerShell in `installers/windows/`.
2. Run the build script:
   ```cmd
   build-installer.bat
   ```
   Or directly via NSIS compiler:
   ```cmd
   makensis AstroCare-Setup.nsi
   ```
3. Run `AstroCare-2.0.0-Setup.exe` and follow the setup wizard to install to `C:\Program Files\AstroCare` with Start Menu and Desktop shortcuts.

### Windows Uninstallation
- From Start Menu: **AstroCare > Uninstall AstroCare**.
- Or via Windows **Settings > Apps > Installed apps > AstroCare > Uninstall**.

---

## 🍎 macOS Installation

### Option A: Portable macOS Application Bundle
1. Extract `installers/macos/AstroCare-2.0.0-macOS-Portable.tar.gz`:
   ```bash
   tar -xzf installers/macos/AstroCare-2.0.0-macOS-Portable.tar.gz
   ```
2. Move `AstroCare.app` into your `/Applications` directory:
   ```bash
   mv AstroCare.app /Applications/
   ```
3. Double-click **AstroCare** in your Applications folder or Spotlight search.

> **Note on macOS Gatekeeper:**  
> Because the application is a research build not signed by an Apple Developer ID, macOS may display a notice stating the developer cannot be verified. To bypass:
> 1. Right-click (or Control-click) `AstroCare.app` in Finder.
> 2. Select **Open**.
> 3. Click **Open** in the confirmation dialog.

### Option B: Building a Styled DMG Disk Image
On macOS machines with `create-dmg` installed (`brew install create-dmg`):
```bash
cd installers/macos
chmod +x create-dmg.sh
./create-dmg.sh
```
This generates `AstroCare-2.0.0.dmg` with drag-and-drop `/Applications` folder shortcut.

---

## 🌐 Server / Headless Mission Control Deployment

To run AstroCare as a persistent system service on an onboard mission telemetry server or ground station:

### 1. Build Production Frontend
```bash
npm run build
```

### 2. Run Production Core Server
```bash
NODE_ENV=production PORT=8000 node backend/server.cjs
```

### 3. Systemd Service Configuration (Linux)
Create `/etc/systemd/system/astrocare.service`:

```ini
[Unit]
Description=AstroCare Flight Telemetry Core
After=network.target

[Service]
Type=simple
User=astrocare
WorkingDirectory=/opt/astrocare
ExecStart=/usr/bin/node /opt/astrocare/backend/server.cjs
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=8000

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now astrocare
sudo systemctl status astrocare
```

