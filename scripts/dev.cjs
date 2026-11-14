/**
 * AstroCare Development Orchestrator
 * Starts backend (Port 8000) and frontend (Port 5173) concurrently.
 * Handles graceful shutdown on SIGINT/SIGTERM.
 */

const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.join(__dirname, '..');

console.log('🚀 [AstroCare] Starting development ecosystem...');

const backend = spawn(process.execPath, [path.join(rootDir, 'backend', 'server.cjs')], {
    stdio: 'inherit',
    cwd: rootDir,
    env: { ...process.env, PORT: '8000' },
});

const frontend = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', '5173'], {
    stdio: 'inherit',
    cwd: path.join(rootDir, 'frontend'),
    shell: true,
});

function shutdown() {
    console.log('\n🛑 [AstroCare] Shutting down development processes...');
    try { backend.kill(); } catch {}
    try { frontend.kill(); } catch {}
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);

