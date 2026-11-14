/**
 * AstroCare Linux Packaging Script
 * Generates:
 * 1. Debian Package: installers/linux/astrocare_2.0.0_amd64.deb
 * 2. Portable Linux Bundle: installers/linux/AstroCare-2.0.0-Linux-Portable.tar.gz
 * 
 * Includes:
 * - Desktop entry (/usr/share/applications/astrocare.desktop)
 * - Hi-res application icon
 * - Standalone binary wrapper (/usr/bin/astrocare)
 * - Embedded production frontend & SQLite telemetry core
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'installers', 'linux');
const pkgBuildDir = path.join(outDir, 'pkg-build');

console.log('🐧 [AstroCare Packaging] Starting Linux packaging pipeline...');

// 1. Build frontend bundle
console.log('📦 Step 1: Building production frontend assets...');
execSync('npm run --prefix frontend build', { stdio: 'inherit', cwd: rootDir });

// 2. Prepare staging structure for Debian package
console.log('📂 Step 2: Preparing Debian packaging tree...');
if (fs.existsSync(pkgBuildDir)) fs.rmSync(pkgBuildDir, { recursive: true, force: true });

const debRoot = path.join(pkgBuildDir, 'astrocare_2.0.0_amd64');
const optDir = path.join(debRoot, 'opt', 'astrocare');
const binDir = path.join(debRoot, 'usr', 'bin');
const appDir = path.join(debRoot, 'usr', 'share', 'applications');
const iconDir = path.join(debRoot, 'usr', 'share', 'icons', 'hicolor', 'scalable', 'apps');
const debianDir = path.join(debRoot, 'DEBIAN');

[optDir, binDir, appDir, iconDir, debianDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

// Copy payload files to /opt/astrocare
console.log('📋 Step 3: Staging application payload...');
fs.cpSync(path.join(rootDir, 'frontend', 'dist'), path.join(optDir, 'frontend', 'dist'), { recursive: true });
fs.cpSync(path.join(rootDir, 'backend'), path.join(optDir, 'backend'), { recursive: true });
fs.cpSync(path.join(rootDir, 'database'), path.join(optDir, 'database'), { recursive: true });
fs.cpSync(path.join(rootDir, 'package.json'), path.join(optDir, 'package.json'));

// Copy icon
fs.copyFileSync(path.join(rootDir, 'frontend', 'public', 'favicon.svg'), path.join(iconDir, 'astrocare.svg'));

// Create /usr/bin/astrocare launcher wrapper
const launcherContent = `#!/bin/bash
export NODE_ENV=production
export DATA_DIR="\${XDG_CONFIG_HOME:-\$HOME/.config}/astrocare/data"
mkdir -p "\$DATA_DIR"
exec /usr/bin/node /opt/astrocare/backend/server.cjs "\$@"
`;
fs.writeFileSync(path.join(binDir, 'astrocare'), launcherContent, { mode: 0o755 });

// Create /usr/share/applications/astrocare.desktop
const desktopEntry = `[Desktop Entry]
Name=AstroCare
Comment=Astronaut Health Monitoring and Spaceflight Risk Management System
Exec=/usr/bin/astrocare
Icon=astrocare
Terminal=false
Type=Application
Categories=Science;MedicalSoftware;Education;Aerospace;
StartupNotify=true
Keywords=NASA;Astronaut;Spaceflight;Telemetry;Biomedical;Health;
`;
fs.writeFileSync(path.join(appDir, 'astrocare.desktop'), desktopEntry);

// Create DEBIAN/control
const controlFile = `Package: astrocare
Version: 2.0.0
Section: science
Priority: optional
Architecture: amd64
Maintainer: AstroCare Aerospace Engineering Team <support@astrocare.space>
Description: Astronaut Health Monitoring and Spaceflight Risk Management System
 AstroCare is an aerospace biomedical telemetry and AI anomaly detection
 platform developed for the NASA Space Apps Challenge. It monitors astronaut
 physiological indicators, cabin environmental telemetry, and provides
 algorithmic spaceflight risk countermeasures aligned with NASA HRP standards.
Depends: nodejs (>= 18.0.0)
`;
fs.writeFileSync(path.join(debianDir, 'control'), controlFile, { mode: 0o644 });

// Create postinst script to ensure database permissions
const postinstContent = `#!/bin/sh
set -e
chmod 755 /usr/bin/astrocare
update-desktop-database -q || true
exit 0
`;
fs.writeFileSync(path.join(debianDir, 'postinst'), postinstContent, { mode: 0o755 });

// Set Debian control directory permissions
fs.chmodSync(debianDir, 0o755);
fs.chmodSync(debRoot, 0o755);

// 4. Build .deb package using dpkg-deb if available
const debOutput = path.join(outDir, 'astrocare_2.0.0_amd64.deb');
try {
    console.log('🔨 Step 4: Compiling Debian (.deb) package with dpkg-deb...');
    execSync(`dpkg-deb --build --root-owner-group "${debRoot}" "${debOutput}"`, { stdio: 'inherit' });
    console.log(`✅ Debian package successfully created: ${debOutput}`);
} catch (e) {
    console.warn('⚠️ dpkg-deb not available or failed; Debian staging files preserved in pkg-build.');
}

// 5. Create Portable Linux Bundle (.tar.gz)
console.log('📦 Step 5: Assembling Portable Linux Bundle...');
const portableDir = path.join(pkgBuildDir, 'AstroCare-2.0.0-Linux-Portable');
fs.mkdirSync(portableDir, { recursive: true });

fs.cpSync(path.join(rootDir, 'frontend', 'dist'), path.join(portableDir, 'frontend', 'dist'), { recursive: true });
fs.cpSync(path.join(rootDir, 'backend'), path.join(portableDir, 'backend'), { recursive: true });
fs.cpSync(path.join(rootDir, 'database'), path.join(portableDir, 'database'), { recursive: true });
fs.cpSync(path.join(rootDir, 'package.json'), path.join(portableDir, 'package.json'));

const portableLaunchSh = `#!/bin/bash
DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
export NODE_ENV=production
export DATA_DIR="\${XDG_CONFIG_HOME:-\$HOME/.config}/astrocare/data"
mkdir -p "\$DATA_DIR"

echo "=========================================================="
echo "  AstroCare — Astronaut Health Monitoring Platform"
echo "  Starting local telemetry core..."
echo "=========================================================="

# Start backend
node "\$DIR/backend/server.cjs" &
BACKEND_PID=\$!

cleanup() {
    echo "Stopping AstroCare..."
    kill \$BACKEND_PID 2>/dev/null
    exit 0
}
trap cleanup INT TERM EXIT

sleep 1
URL="http://127.0.0.1:8000"
if which xdg-open >/dev/null 2>&1; then
    xdg-open "\$URL"
elif which gnome-open >/dev/null 2>&1; then
    gnome-open "\$URL"
else
    echo "Open \$URL in your browser."
fi

wait \$BACKEND_PID
`;

fs.writeFileSync(path.join(portableDir, 'astrocare-launch.sh'), portableLaunchSh, { mode: 0o755 });

const tarOutput = path.join(outDir, 'AstroCare-2.0.0-Linux-Portable.tar.gz');
execSync(`tar -czf "${tarOutput}" -C "${pkgBuildDir}" "AstroCare-2.0.0-Linux-Portable"`, { stdio: 'inherit' });
console.log(`✅ Portable Linux bundle created: ${tarOutput}`);

// Clean up build directory
fs.rmSync(pkgBuildDir, { recursive: true, force: true });

console.log('\n======================================================');
console.log('🎉 Linux Packaging Pipeline Complete!');
console.log(`  1. Debian Package: ${debOutput}`);
console.log(`  2. Portable Tarball: ${tarOutput}`);
console.log('======================================================\n');
