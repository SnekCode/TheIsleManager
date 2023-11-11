import { ipcMain } from "electron";

ipcMain.on('configGame', (_, arg) => {
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