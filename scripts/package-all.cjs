/**
 * AstroCare Multi-Platform Master Packaging Script
 * Coordinates cross-platform packaging for Linux, Windows, and macOS.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const installersDir = path.join(rootDir, 'installers');

console.log('🚀 [AstroCare Packaging] Starting Multi-Platform Cross-Packaging Suite...');
console.log('========================================================================\n');

const startTime = Date.now();

try {
  // Step 1: Linux Packaging
  console.log('>>> [1/3] EXECUTING LINUX TARGET PACKAGING...');
  execSync('node scripts/package-linux.cjs', { stdio: 'inherit', cwd: rootDir });

  // Step 2: Windows Packaging
  console.log('\n>>> [2/3] EXECUTING WINDOWS TARGET PACKAGING...');
  execSync('node scripts/package-windows.cjs', { stdio: 'inherit', cwd: rootDir });

  // Step 3: macOS Packaging
  console.log('\n>>> [3/3] EXECUTING MACOS TARGET PACKAGING...');
  execSync('node scripts/package-mac.cjs', { stdio: 'inherit', cwd: rootDir });

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  // Collect artifact manifest
  console.log('\n========================================================================');
  console.log(`✨ ALL TARGETS PACKAGED SUCCESSFULLY IN ${durationSec}s`);
  console.log('========================================================================');
  console.log('\n📦 DISTRIBUTION ARTIFACT MANIFEST:');

  const targets = [
    { os: 'Linux (Debian)', file: 'linux/astrocare_2.0.0_amd64.deb' },
    { os: 'Linux (Portable)', file: 'linux/AstroCare-2.0.0-Linux-Portable.tar.gz' },
    { os: 'Windows (Portable)', file: 'windows/AstroCare-2.0.0-Windows-Portable.zip' },
    { os: 'Windows (NSIS Spec)', file: 'windows/AstroCare-Setup.nsi' },
    { os: 'macOS (Portable App)', file: 'macos/AstroCare-2.0.0-macOS-Portable.tar.gz' },
    { os: 'macOS (App Bundle)', file: 'macos/AstroCare.app' },
    { os: 'macOS (DMG Script)', file: 'macos/create-dmg.sh' }
  ];

  targets.forEach(t => {
    const fullPath = path.join(installersDir, t.file);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const sizeStr = stats.isDirectory() ? '[Directory]' : `${(stats.size / 1024).toFixed(1)} KB`;
      console.log(`  • [${t.os.padEnd(22)}] ${t.file.padEnd(46)} (${sizeStr})`);
    } else {
      console.log(`  • [${t.os.padEnd(22)}] ${t.file.padEnd(46)} [MISSING]`);
    }
  });

  console.log('\n🚀 Deployable distributions ready in ./installers/\n');
} catch (err) {
  console.error('\n❌ Error during cross-platform packaging:', err.message);
  process.exit(1);
}

