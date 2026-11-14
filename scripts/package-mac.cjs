/**
 * AstroCare macOS Packaging Script
 * Generates:
 * 1. Native macOS App Bundle: installers/macos/AstroCare.app
 * 2. Portable macOS Archive: installers/macos/AstroCare-2.0.0-macOS-Portable.tar.gz
 * 3. DMG Creation Script & Notarization Guide: installers/macos/create-dmg.sh
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'installers', 'macos');
const appBundleDir = path.join(outDir, 'AstroCare.app');

console.log('🍎 [AstroCare Packaging] Starting macOS packaging pipeline...');

// Ensure output directory exists
if (fs.existsSync(appBundleDir)) {
  fs.rmSync(appBundleDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Step 1: Ensure frontend is built
const distDir = path.join(rootDir, 'frontend', 'dist');
if (!fs.existsSync(distDir) || fs.readdirSync(distDir).length === 0) {
  console.log('📦 Step 1: Building production frontend assets...');
  execSync('npm run --prefix frontend build', { stdio: 'inherit', cwd: rootDir });
} else {
  console.log('✅ Step 1: Production frontend build detected.');
}

// Step 2: Assemble macOS App Bundle structure
console.log('📂 Step 2: Creating macOS App Bundle directory structure...');
const contentsDir = path.join(appBundleDir, 'Contents');
const macosDir = path.join(contentsDir, 'MacOS');
const resourcesDir = path.join(contentsDir, 'Resources');
const appPayloadDir = path.join(resourcesDir, 'app');

[macosDir, resourcesDir, appPayloadDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

// Step 3: Copy application payload
console.log('📋 Step 3: Staging application payload into Resources/app...');
fs.cpSync(path.join(rootDir, 'frontend', 'dist'), path.join(appPayloadDir, 'frontend', 'dist'), { recursive: true });
fs.cpSync(path.join(rootDir, 'backend'), path.join(appPayloadDir, 'backend'), { recursive: true });
fs.cpSync(path.join(rootDir, 'database'), path.join(appPayloadDir, 'database'), { recursive: true });
fs.cpSync(path.join(rootDir, 'desktop'), path.join(appPayloadDir, 'desktop'), { recursive: true });
fs.cpSync(path.join(rootDir, 'package.json'), path.join(appPayloadDir, 'package.json'));

// Copy icon
fs.copyFileSync(path.join(rootDir, 'frontend', 'public', 'favicon.svg'), path.join(resourcesDir, 'astrocare.svg'));

// Step 4: Write Info.plist
console.log('📄 Step 4: Generating Contents/Info.plist...');
const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>ASTR</string>
    <key>CFBundleIdentifier</key>
    <string>space.astrocare.desktop</string>
    <key>CFBundleName</key>
    <string>AstroCare</string>
    <key>CFBundleDisplayName</key>
    <string>AstroCare</string>
    <key>CFBundleVersion</key>
    <string>2.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>2.0.0</string>
    <key>CFBundleExecutable</key>
    <string>AstroCare</string>
    <key>CFBundleIconFile</key>
    <string>astrocare</string>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.healthcare-fitness</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSHumanReadableCopyright</key>
    <string>Copyright © 2026 NASA Space Apps Challenge Team. All rights reserved.</string>
</dict>
</plist>
`;
fs.writeFileSync(path.join(contentsDir, 'Info.plist'), infoPlist, 'utf8');

// Step 5: Write PkgInfo
fs.writeFileSync(path.join(contentsDir, 'PkgInfo'), 'APPLASTR', 'utf8');

// Step 6: Write executable launcher in Contents/MacOS/AstroCare
console.log('🚀 Step 6: Writing Contents/MacOS/AstroCare launcher...');
const macLauncher = `#!/bin/bash
# AstroCare macOS Native Application Launcher
set -e

DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )/.." && pwd )"
APP_DIR="$DIR/Resources/app"

export NODE_ENV=production
export DATA_DIR="$HOME/Library/Application Support/AstroCare/data"
mkdir -p "$DATA_DIR"

# Locate Node.js binary
NODE_BIN=""
if command -v node >/dev/null 2>&1; then
    NODE_BIN="$(command -v node)"
elif [ -x "/opt/homebrew/bin/node" ]; then
    NODE_BIN="/opt/homebrew/bin/node"
elif [ -x "/usr/local/bin/node" ]; then
    NODE_BIN="/usr/local/bin/node"
fi

if [ -z "$NODE_BIN" ]; then
    osascript -e 'display alert "Node.js Required" message "AstroCare requires Node.js v18 or higher to execute the local flight telemetry core. Please install Node.js from https://nodejs.org or via Homebrew (brew install node)."'
    exit 1
fi

# Launch backend telemetry server in background
"$NODE_BIN" "$APP_DIR/backend/server.cjs" &
SERVER_PID=$!

# Ensure server terminates when this wrapper exits
trap "kill $SERVER_PID 2>/dev/null || true" EXIT INT TERM

# Wait for server initialization
sleep 1.2

# Open AstroCare dashboard in default browser
open "http://127.0.0.1:8000"

# Keep wrapper active while backend runs
wait $SERVER_PID
`;
const launcherPath = path.join(macosDir, 'AstroCare');
fs.writeFileSync(launcherPath, macLauncher, { mode: 0o755 });

// Step 7: Create DMG Builder Script
console.log('💿 Step 7: Generating DMG Creator Script (create-dmg.sh)...');
const dmgScript = `#!/bin/bash
# AstroCare macOS DMG Packaging Helper
# Requires 'create-dmg' utility: brew install create-dmg

set -e

SCRIPT_DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
APP_PATH="$SCRIPT_DIR/AstroCare.app"
DMG_PATH="$SCRIPT_DIR/AstroCare-2.0.0.dmg"

if ! command -v create-dmg &> /dev/null; then
    echo "Using hdiutil to create standard macOS disk image..."
    hdiutil create -volname "AstroCare" -srcfolder "$APP_PATH" -ov -format UDZO "$DMG_PATH"
else
    echo "Creating styled DMG using create-dmg..."
    create-dmg \\
      --volname "AstroCare Installer" \\
      --window-pos 200 120 \\
      --window-size 600 400 \\
      --icon-size 100 \\
      --icon "AstroCare.app" 175 120 \\
      --hide-extension "AstroCare.app" \\
      --app-drop-link 425 120 \\
      "$DMG_PATH" \\
      "$APP_PATH"
fi

echo "✅ DMG generated successfully: $DMG_PATH"
`;
fs.writeFileSync(path.join(outDir, 'create-dmg.sh'), dmgScript, { mode: 0o755 });

// Step 8: Create Portable macOS Tarball
console.log('🗜️ Step 8: Packaging AstroCare-2.0.0-macOS-Portable.tar.gz...');
const tarGzPath = path.join(outDir, 'AstroCare-2.0.0-macOS-Portable.tar.gz');
execSync(`tar -czf "${tarGzPath}" -C "${outDir}" AstroCare.app`, {
  stdio: 'inherit',
  cwd: rootDir
});

console.log(`✅ macOS App Bundle created: ${appBundleDir}`);
console.log(`✅ Portable macOS Archive created: ${tarGzPath}`);
console.log(`✅ DMG Helper Script created: ${path.join(outDir, 'create-dmg.sh')}`);

console.log('\n======================================================');
console.log('🎉 macOS Packaging Pipeline Complete!');
console.log(`  1. App Bundle: ${appBundleDir}`);
console.log(`  2. Tarball:    ${tarGzPath}`);
console.log(`  3. DMG Script: ${path.join(outDir, 'create-dmg.sh')}`);
console.log('======================================================\n');

