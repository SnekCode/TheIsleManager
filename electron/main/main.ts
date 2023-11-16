import { app, BrowserWindow } from "electron";
import path from "node:path";
import pkg from "~/package.json";
import log from "electron-log/main";

log.initialize({ preload: true });
// get a formated date and time as a string for the log file name DD/MM/YYYY HH:MM:SS
const date = new Date().toLocaleString().replace(/\//g, "-").replace(/:/g, "-").replace(/,/g, "");
const pathToLog = path.join(process.env.APPDATA ?? __dirname, `${pkg.name}/logs/${date}.log`);
log.transports.file.resolvePathFn = () => pathToLog;
console.log = log.log;

console.log(pathToLog);

// handle update
import "../updater/updater";

// load main ipc actions
import "../GameManager/main/actions";
import "./store";

// handle file config
import "../GameManager/setupConfig";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

const electronDist = path.join(__dirname, "../");
const dist = path.join(electronDist, "../dist");
const url = process.env.VITE_DEV_SERVER_URL;
const vitePublic = url ? path.join(electronDist, "../public") : dist;
const indexHtml = path.join(dist, "index.html");

// set up env based on const above
process.env.ELECTRON_DIST = electronDist;
process.env.DIST = dist;
process.env.VITE_PUBLIC = vitePublic;
process.env.VITE_DEV_SERVER_URL = url;

// process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

export let win: BrowserWindow;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
// const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const preload = path.join(__dirname, "../preload/preload.js");

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(vitePublic, "electron-vite.svg"),
    webPreferences: {
      preload,
    },
    // set title
    title: `The Isle Manager ${pkg.version}`,
    maximizable: false,
    center: true,
    resizable: false,
    width: 800,
    height: 600,
    // set min size
    minWidth: 800,
    minHeight: 600,
    // set max size
    maxWidth: 800,
    maxHeight: 600,
  });
  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (import.meta.env.DEV) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  if (url) {
    console.log("loadURL", url);

    win.loadURL(url);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(indexHtml);
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    // @ts-expect-error win is not null
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

export const getWin = () => win;
