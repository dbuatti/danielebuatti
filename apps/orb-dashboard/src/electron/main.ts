import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { exec } from 'node:child_process';
import os from 'node:os';

const scriptPath = path.join(os.homedir(), 'Library', 'Scripts', 'mount-nas.zsh');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 400,
    title: 'The Orb',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 10, y: 10 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../assets/orb-icon.png'),
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  } else {
    win.loadURL('http://localhost:5173');
  }
  if (!app.isPackaged) win.webContents.openDevTools({ mode: 'detach' });
}

function collectSystemInfo() {
  const info = {
    timestamp: new Date().toISOString(),
    hostname: require('node:os').hostname(),
    network: getNetworkInfo(),
    launchAgents: getLaunchAgents(),
    ipAddresses: getIPAddresses(),
  };
  return info;
}

function getNetworkInfo() {
  try {
    const os = require('node:os');
    const interfaces = os.networkInterfaces();
    return interfaces;
  } catch (e) { return {}; }
}

function getLaunchAgents() {
  try {
    const { execSync } = require('node:child_process');
    const out = execSync('launchctl list 2>/dev/null || echo "N/A"', { encoding: 'utf8', timeout: 5000 });
    return out.trim();
  } catch (e) { return 'Could not collect'; }
}

function getIPAddresses() {
  try {
    const { execSync } = require('node:child_process');
    const out = execSync('ifconfig | grep "inet " | awk \'{print $2}\' 2>/dev/null || echo "N/A"', { encoding: 'utf8', timeout: 5000 });
    return out.trim();
  } catch (e) { return 'Could not collect'; }
}

ipcMain.handle('get-system-info', () => collectSystemInfo());

ipcMain.handle('open-comm-analytics', async () => {
  const appPath = '/Applications/Comm Analytics.app';
  try {
    await shell.openPath(appPath);
    return { success: true, message: 'Comm Analytics.app launched' };
  } catch (e) {
    const { execSync } = require('node:child_process');
    try {
      execSync('open "/Applications/Comm Analytics.app"');
      return { success: true, message: 'Comm Analytics.app launched via open' };
    } catch (e2) {
      return { success: false, message: 'Could not open Comm Analytics.app' };
    }
  }
});

ipcMain.handle('save-data', (event, payload) => {
  const dataDir = path.join(app.getPath('userData'), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, `snapshot-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(file, JSON.stringify(payload, null, 2));
  return { saved: file };
});

ipcMain.handle('run-mount-nas', async () => {
  try {
    const result = await new Promise<{ stdout: string; stderr: string; success: boolean }>((resolve, reject) => {
      exec(scriptPath, (error, outStdout, outStderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout: outStdout || '', stderr: outStderr || '', success: true });
        }
      });
    });
    return { stdout: result.stdout, stderr: result.stderr, success: true };
  } catch (e) {
    return { error: String(e), success: false };
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  const info = collectSystemInfo();
  const dataDir = path.join(app.getPath('userData'), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, `backup-${new Date().toISOString()}.json`);
  fs.writeFileSync(file, JSON.stringify(info, null, 2));
});