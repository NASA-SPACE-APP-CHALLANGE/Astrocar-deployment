/**
 * AstroCare Desktop Application Main Process
 * Cross-Platform Electron Shell (Windows, macOS, Linux)
 * 
 * Features:
 * - Native application lifecycle management
 * - Automatic local telemetry backend server orchestration
 * - Secure isolation (contextIsolation, disabled nodeIntegration)
 * - Safe data persistence in user data directory
 * - Clean shutdown without orphan processes
 */

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

let mainWindow = null;
let backendProcess = null;
const BACKEND_PORT = process.env.ASTROCARE_PORT || 8000;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function checkBackendReady(port, retries = 30, delay = 300) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
                if (res.statusCode === 200) {
                    clearInterval(interval);
                    resolve(true);
                }
            });

            req.on('error', () => {
                if (attempts >= retries) {
                    clearInterval(interval);
                    resolve(false);
                }
            });
            req.end();
        }, delay);
    });
}

function startBackend() {
    return new Promise((resolve) => {
        const serverScript = isDev
            ? path.join(__dirname, '..', 'backend', 'server.cjs')
            : path.join(process.resourcesPath, 'backend', 'server.cjs');

        const dbDir = isDev
            ? path.join(__dirname, '..', 'backend', 'data')
            : path.join(app.getPath('userData'), 'data');

        console.log(`[AstroCare Desktop] Starting telemetry backend: ${serverScript}`);
        console.log(`[AstroCare Desktop] Data directory: ${dbDir}`);

        backendProcess = spawn(process.execPath, [serverScript], {
            env: {
                ...process.env,
                PORT: String(BACKEND_PORT),
                DATA_DIR: dbDir,
                NODE_ENV: isDev ? 'development' : 'production',
            },
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        backendProcess.stdout?.on('data', (d) => {
            console.log(`[Telemetry Backend] ${d.toString().trim()}`);
        });

        backendProcess.stderr?.on('data', (d) => {
            console.error(`[Telemetry Backend Error] ${d.toString().trim()}`);
        });

        backendProcess.on('exit', (code, signal) => {
            console.log(`[Telemetry Backend] Process exited with code ${code}, signal ${signal}`);
            backendProcess = null;
        });

        checkBackendReady(BACKEND_PORT).then((ready) => {
            if (ready) {
                console.log(`[AstroCare Desktop] Telemetry backend ready on port ${BACKEND_PORT}`);
            } else {
                console.warn(`[AstroCare Desktop] Telemetry backend took longer than expected to report ready`);
            }
            resolve(true);
        });
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 920,
        minWidth: 1080,
        minHeight: 700,
        title: 'AstroCare — Astronaut Health Monitoring & Risk Management System',
        backgroundColor: '#0B1026',
        icon: path.join(__dirname, '..', 'frontend', 'public', 'favicon.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
        autoHideMenuBar: true,
        show: false,
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    if (isDev && process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else if (isDev) {
        mainWindow.loadURL('http://127.0.0.1:5173');
    } else {
        const prodPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
        mainWindow.loadFile(prodPath);
    }

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http:') || url.startsWith('https:')) {
            shell.openExternal(url);
        }
        return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Window control IPC handlers
ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) mainWindow.unmaximize();
        else mainWindow.maximize();
    }
});

ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
});

ipcMain.on('open-external', (_event, url) => {
    if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
        shell.openExternal(url);
    }
});

ipcMain.handle('get-system-info', () => {
    return {
        appVersion: '2.0.0',
        platform: process.platform,
        arch: process.arch,
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node,
        backendPort: BACKEND_PORT,
    };
});

function stopBackend() {
    if (backendProcess) {
        console.log('[AstroCare Desktop] Terminating telemetry backend child process...');
        try {
            backendProcess.kill('SIGTERM');
        } catch (e) {
            console.error('Error killing backend process:', e);
        }
        backendProcess = null;
    }
}

app.whenReady().then(async () => {
    await startBackend();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    stopBackend();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopBackend();
});

app.on('will-quit', () => {
    stopBackend();
});

