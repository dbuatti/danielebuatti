import { ipcMain as c, shell as p, app as o, BrowserWindow as u } from "electron";
import s from "node:path";
import r from "node:fs";
import { exec as h } from "node:child_process";
import f from "node:os";
const y = s.join(f.homedir(), "Library", "Scripts", "mount-nas.zsh");
function a() {
  const e = new u({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 400,
    title: "The Orb",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 10, y: 10 },
    webPreferences: {
      preload: s.join(__dirname, "preload.js"),
      contextIsolation: !0,
      nodeIntegration: !1
    },
    icon: s.join(__dirname, "../assets/orb-icon.png")
  });
  o.isPackaged ? e.loadFile(s.join(__dirname, "../renderer/index.html")) : e.loadURL("http://localhost:5173"), o.isPackaged || e.webContents.openDevTools({ mode: "detach" });
}
function l() {
  return {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    hostname: require("node:os").hostname(),
    network: g(),
    launchAgents: w(),
    ipAddresses: S()
  };
}
function g() {
  try {
    return require("node:os").networkInterfaces();
  } catch {
    return {};
  }
}
function w() {
  try {
    const { execSync: e } = require("node:child_process");
    return e('launchctl list 2>/dev/null || echo "N/A"', { encoding: "utf8", timeout: 5e3 }).trim();
  } catch {
    return "Could not collect";
  }
}
function S() {
  try {
    const { execSync: e } = require("node:child_process");
    return e(`ifconfig | grep "inet " | awk '{print $2}' 2>/dev/null || echo "N/A"`, { encoding: "utf8", timeout: 5e3 }).trim();
  } catch {
    return "Could not collect";
  }
}
c.handle("get-system-info", () => l());
c.handle("open-comm-analytics", async () => {
  const e = "/Applications/Comm Analytics.app";
  try {
    return await p.openPath(e), { success: !0, message: "Comm Analytics.app launched" };
  } catch {
    const { execSync: n } = require("node:child_process");
    try {
      return n('open "/Applications/Comm Analytics.app"'), { success: !0, message: "Comm Analytics.app launched via open" };
    } catch {
      return { success: !1, message: "Could not open Comm Analytics.app" };
    }
  }
});
c.handle("save-data", (e, t) => {
  const n = s.join(o.getPath("userData"), "data");
  r.existsSync(n) || r.mkdirSync(n, { recursive: !0 });
  const i = s.join(n, `snapshot-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`);
  return r.writeFileSync(i, JSON.stringify(t, null, 2)), { saved: i };
});
c.handle("run-mount-nas", async () => {
  try {
    const e = await new Promise((t, n) => {
      h(y, (i, d, m) => {
        i ? n(i) : t({ stdout: d || "", stderr: m || "", success: !0 });
      });
    });
    return { stdout: e.stdout, stderr: e.stderr, success: !0 };
  } catch (e) {
    return { error: String(e), success: !1 };
  }
});
o.whenReady().then(() => {
  a(), o.on("activate", () => {
    u.getAllWindows().length === 0 && a();
  });
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
o.on("before-quit", () => {
  const e = l(), t = s.join(o.getPath("userData"), "data");
  r.existsSync(t) || r.mkdirSync(t, { recursive: !0 });
  const n = s.join(t, `backup-${(/* @__PURE__ */ new Date()).toISOString()}.json`);
  r.writeFileSync(n, JSON.stringify(e, null, 2));
});
