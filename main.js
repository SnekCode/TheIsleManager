const { app, BrowserWindow, ipcMain, ipcRenderer, Menu} = require('electron')
const path = require('node:path')
const Store = require('electron-store');
const { checkOutAppData, checkInAppData, startGame, checksForInstall, gameNames, setUpEvrima, setUpLegacy } = require('./index.js');
const { exit } = require('node:process');
const fs = require('fs');

let win = null;
const store = new Store();
const appState = {
  lock: false
};

// function createShortCut(name){
//   const targetPath = path.join(app.getPath('exe'));
//   const shortcutContents = `[InternetShortcut]
//   URL=file://${targetPath}
//   IconFile=${targetPath}
//   IconIndex=0`;

//   const desktopPath = app.getPath('desktop');
//   console.log(desktopPath, targetPath);
//   const shortcutPath = path.join(desktopPath, 'The Isle Manager.url');

//   fs.writeFile(shortcutPath, shortcutContents, (err) => {
//     if (err) throw err;
//     console.log(`Shortcut created at ${shortcutPath}`);
//   });
// }

// createShortCut();
// set first run
if(store.get('state') === undefined){
  store.set('state', 'init');
}

console.log(store.path);

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "Tools",
    submenu: [
      {
        label: "reset app",
        click() {
          store.clear();
          // hard reload
          app.relaunch();
          app.exit();
        }
      }
    ]
  }
]);

const createWindow = () => {
  win = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'The Isle Launcher',
  })
  win.setMenu(menu);
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  // load app state config from file
  createWindow()
  win.webContents.send('init', store.get('state'));
})

ipcMain.on('configGame', (event, arg) => {
  if(appState.lock){
    return;
  }
  console.log("configGame", arg);
  appState.lock = true;
  win.webContents.send('lock', true)
  if(arg === gameNames.legacy){
    // first check if evrima is set
    checkInAppData(gameNames.evrima);
    checkOutAppData(gameNames.legacy);
  }else if (arg === gameNames.evrima){
    // first check if legacy is setup
    checkInAppData(gameNames.legacy);
    checkOutAppData(gameNames.evrima);
  }
  appState.lock = false;
  setTimeout(() => {
  win.webContents.send('lock', false)
  }, 1000);
});

ipcMain.on('startGame', (event, arg) => {
  if(appState.lock){
    return;
  }
  appState.lock = true;
  win.webContents.send('lock', true)
  //start game is async
  startGame(arg).then(() => {
    appState.lock = false;
    win.webContents.send('lock', false)
  });
});

ipcMain.on('setupLegacy', (event, arg) => {
  win.webContents.send('hideMessage')
  console.log('setupLegacy');
  if(checksForInstall(gameNames.legacy)){
    store.set('legacy', 'complete')
    store.set('state', gameNames.evrima);
  }else if(setUpLegacy()){
    store.set('state', gameNames.evrima);
    store.set('legacy', 'complete');
  }else{
    win.webContents.send('showMessage', 'Failed to setup legacy. No Install Found.  Please Install Legacy and try again.');
  }
  win.webContents.send('init', store.get('state'));
})

let installCheck = null;

function checkForEvrima(){
  if(checksForInstall(gameNames.evrima)){
    win.webContents.send('init', 'complete');
    store.set('state', 'complete');
    // setUpEvrima();
    return true;
  }else {
    return false;
  }}

ipcMain.on('checkEvrima', (event, arg) => {

  // check for legacy install
  if(!checksForInstall(gameNames.legacy)){
    store.set('state', 'init');
    win.webContents.send('init', 'init');
    return;
  }
  if(!checkForEvrima()){
    installCheck = setInterval(checkForEvrima, 10000);
  }
})

ipcMain.on('stopCheckEvrima', (event, arg) => {
  clearInterval(installCheck);
})