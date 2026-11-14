/**
 * AstroCare Desktop Application Launcher
 * Boots the telemetry core and opens AstroCare in dedicated desktop mode.
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');
const PORT = process.env.PORT || 8000;

console.log('🛸 [AstroCare Desktop Launcher] Initializing desktop runtime...');

// 1. Ensure production frontend build exists
const distIndex = path.join(rootDir, 'frontend', 'dist', 'index.html');
if (!fs.existsSync(distIndex)) {
    console.log('📦 Frontend bundle not found. Building production assets...');
    const { execSync } = require('child_process');
    execSync('npm run --prefix frontend build', { stdio: 'inherit', cwd: rootDir });
}

// 2. Start the telemetry backend
const backend = spawn(process.execPath, [path.join(rootDir, 'backend', 'server.cjs')], {
    stdio: 'inherit',
    cwd: rootDir,
    env: { ...process.env, PORT: String(PORT) },
});

// 3. Wait for backend to be ready
function waitForReady(port, retries = 20) {
    if (retries <= 0) {
        console.error('❌ Telemetry core failed to start in time.');
        backend.kill();
        process.exit(1);
    }
    http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
        if (res.statusCode === 200) {
            console.log(`\n======================================================`);
            console.log(`✨ AstroCare Aerospace Health Platform Ready!`);
            console.log(`🌐 Application URL: http://127.0.0.1:${port}/`);
            console.log(`📡 Telemetry Core:  http://127.0.0.1:${port}/api/health`);
            console.log(`======================================================\n`);

            // Try to open browser in app mode
            const url = `http://127.0.0.1:${port}/`;
            const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
            try {
                spawn(cmd, [url], { shell: true });
            } catch (e) {
                console.log(`Open ${url} in your browser.`);
            }
        }
    }).on('error', () => {
        setTimeout(() => waitForReady(port, retries - 1), 300);
    });
}

waitForReady(PORT);

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down AstroCare Desktop...');
    backend.kill();
    process.exit(0);
});

