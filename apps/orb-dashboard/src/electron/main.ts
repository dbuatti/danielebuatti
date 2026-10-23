import { app, BrowserWindow, ipcMain, shell, safeStorage, webContents } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { exec, execSync } from 'node:child_process';
import os from 'node:os';
import http from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const scriptPath = path.join(os.homedir(), 'Library', 'Scripts', 'mount-nas.zsh');
const credFile = path.join(app.getPath('userData'), 'nas-credentials.enc');
const WEB_PORT = 8450;

// --- Web Server for remote access via Tailscale ---
let webServer: http.Server | null = null;

function startWebServer() {
  if (webServer) return;
  const rendererDir = path.join(__dirname, 'renderer');

  webServer = http.createServer((req, res) => {
    // API endpoints
    if (req.url === '/api/system-info') {
      const info = collectSystemInfo();
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(info));
      return;
    }

    if (req.url === '/api/nas-creds' && req.method === 'GET') {
      if (!fs.existsSync(credFile)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'No saved credentials' }));
        return;
      }
      if (!safeStorage.isEncryptionAvailable()) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Encryption not available' }));
        return;
      }
      try {
        const encrypted = fs.readFileSync(credFile);
        const decrypted = safeStorage.decryptString(encrypted);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, creds: JSON.parse(decrypted) }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: String(e) }));
      }
      return;
    }

    // Static files
    let filePath = req.url === '/' ? '/index.html' : req.url || '/index.html';
    filePath = path.join(rendererDir, filePath.split('?')[0]);

    const ext = path.extname(filePath);
    const mimeTypes: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        // SPA fallback
        fs.readFile(path.join(rendererDir, 'index.html'), (err2, data2) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        });
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });

  webServer.listen(WEB_PORT, '0.0.0.0', () => {
    console.log(`Web server running on port ${WEB_PORT}`);
  });
}

function stopWebServer() {
  if (webServer) {
    webServer.close();
    webServer = null;
  }
}

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
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  } else {
    win.loadURL('http://localhost:5173');
  }
  if (!app.isPackaged) win.webContents.openDevTools({ mode: 'detach' });
}

function collectSystemInfo() {
  const info = {
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    network: getNetworkInfo(),
    launchAgents: getLaunchAgents(),
    ipAddresses: getIPAddresses(),
  };
  return info;
}

function getNetworkInfo() {
  try {
    return os.networkInterfaces();
  } catch (e) { return {}; }
}

function getLaunchAgents() {
  try {
    const out = execSync('launchctl list 2>/dev/null || echo "N/A"', { encoding: 'utf8', timeout: 5000 });
    return out.trim();
  } catch (e) { return 'Could not collect'; }
}

function getIPAddresses() {
  try {
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

ipcMain.handle('save-nas-creds', (event, creds) => {
  if (!safeStorage.isEncryptionAvailable()) {
    return { success: false, message: 'Encryption not available' };
  }
  try {
    const encrypted = safeStorage.encryptString(JSON.stringify(creds));
    fs.writeFileSync(credFile, encrypted);
    return { success: true, message: 'Credentials saved (encrypted)' };
  } catch (e) {
    return { success: false, message: String(e) };
  }
});

ipcMain.handle('load-nas-creds', () => {
  if (!fs.existsSync(credFile)) {
    return { success: false, message: 'No saved credentials' };
  }
  if (!safeStorage.isEncryptionAvailable()) {
    return { success: false, message: 'Encryption not available' };
  }
  try {
    const encrypted = fs.readFileSync(credFile);
    const decrypted = safeStorage.decryptString(encrypted);
    return { success: true, creds: JSON.parse(decrypted) };
  } catch (e) {
    return { success: false, message: String(e) };
  }
});

// Web server IPC
ipcMain.handle('start-web-server', () => {
  startWebServer();
  return { port: WEB_PORT, url: `http://0.0.0.0:${WEB_PORT}` };
});

ipcMain.handle('stop-web-server', () => {
  stopWebServer();
  return { stopped: true };
});

app.whenReady().then(() => {
  // Handle external links - open in default browser
  app.on('web-contents-created', (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('smb://')) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
      return { action: 'allow' };
    });
  });

  createWindow();
  console.log('Window created');
  // Auto-start web server for remote access
  startWebServer();
  console.log('Web server started');
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  stopWebServer();
  const info = collectSystemInfo();
  const dataDir = path.join(app.getPath('userData'), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, `backup-${new Date().toISOString()}.json`);
  fs.writeFileSync(file, JSON.stringify(info, null, 2));
});