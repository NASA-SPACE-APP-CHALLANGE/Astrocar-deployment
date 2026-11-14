/**
 * AstroCare Clean Script
 * Removes build artifacts, caches, and temporary files safely.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirsToClean = [
    path.join(rootDir, 'frontend', 'dist'),
    path.join(rootDir, 'dist-electron'),
    path.join(rootDir, 'installers', 'linux', 'pkg-build'),
    path.join(rootDir, '.cache'),
];

console.log('🧹 [AstroCare Clean] Cleaning build artifacts and cache...');

dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`  Deleting: ${path.relative(rootDir, dir)}`);
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

console.log('✨ [AstroCare Clean] Cleanup completed.');

