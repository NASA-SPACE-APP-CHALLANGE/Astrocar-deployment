/**
 * AstroCare Desktop Preload Script
 * Implements secure contextBridge isolation according to Electron Security Best Practices.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    isDesktop: true,
    version: '2.0.0',
    minimizeWindow: () => ipcRenderer.send('window-minimize'),
    maximizeWindow: () => ipcRenderer.send('window-maximize'),
    closeWindow: () => ipcRenderer.send('window-close'),
    openExternal: (url) => ipcRenderer.send('open-external', url),
    getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
});

