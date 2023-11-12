import { app, BrowserWindow, Menu } from 'electron'
import path from 'node:path'
import packagejson from '~/package.json'
import log from 'electron-log/main';
import { store } from './ipc/main/store';

log.initialize({ preload: true });
console.log = log.log;

// handle update
import './updater/updater'

// load main ipc actions
import './GameManager/ipc/main/index'
import './ipc/main/store'
import { createMenu } from './ipc/main/menu';

// handle auto update

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


export let win: BrowserWindow
const menu = createMenu()
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  let windowConfig = {
    width: 800,
    height: 600
  }
  const bounds = store.get("windowBounds")
  if(bounds){
    windowConfig = {
      ...windowConfig,
      ...bounds
    }
  }
  
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    // set title
    title: `The Isle Manager ${packagejson.version}`,
    // this disables resizing the window
    thickFrame: false,
    // set window position
    ...windowConfig
  })
  // if dev mode with vite
  if(import.meta.env.DEV){
    win.webContents.openDevTools({ mode: 'detach' });
  }
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    win.setAlwaysOnTop(false)
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
  win.setMenu(menu)
  win.on("moved", () => {
    store.set("windowBounds", win.getNormalBounds());
  })
  win.setAlwaysOnTop(true);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    // @ts-expect-error win is not null
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
    createMenu()
  }
})


app.whenReady().then(createWindow)

export const getWin = () => win