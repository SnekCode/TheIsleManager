import { ipcMain, dialog } from "electron";
import { getWin, win } from "~/electron/main/main";
import {store} from '../../main/store/store'
import {
  startGame,
  setUpLegacy,
  updatePath,
  swapVersion
} from "../index";
import { EChannels, channelLog } from "Shared/channels";
import { EGameNames } from "Shared/gamenames";
import {setupConfig} from '../setupConfig';

let defaultPath = `C:\\`

const appState = {
  lock: false,
};

// set first run
if (store.get("state") === undefined) {
  store.set("state", "init");
}

ipcMain.on(EChannels.configGame, (_, arg: EGameNames) => {
  channelLog(EChannels.configGame, "receiving", arg);
  if (appState.lock) {
    channelLog(EChannels.configGame, "sending", "failed", "app locked");
    win.webContents.send(EChannels.configGame, store.get("loadedGame"));
    return;
  }
  appState.lock = true;
  channelLog(EChannels.lock, "sending", true);
  win.webContents.send(EChannels.lock, true);
  const [success, gameName] = swapVersion(arg);
  if (success) {
    console.log("SUCCESS");
    
    appState.lock = false;
    setTimeout(() => {
      channelLog(EChannels.lock, "sending", false);
      win.webContents.send(EChannels.lock, false);
      channelLog(EChannels.configGame, "sending", gameName);
      win.webContents.send(EChannels.configGame, gameName);
      store.set("loadedGame", gameName);
    }, 1000);
  }else{
    console.log("FAIL");
    
    appState.lock = false;
    channelLog(EChannels.lock, "sending", false);
    win.webContents.send(EChannels.lock, false);
    channelLog(EChannels.configGame, "sending", "failed", "failed to swap version; current loaded game:", gameName);
    channelLog(EChannels.configGame, "sending", gameName);
    win.webContents.send(EChannels.configGame, gameName);
  }
});

ipcMain.on(EChannels.startGame, (_, args) => {
  if (appState.lock) {
    return;
  }
  console.log(args);
  const name = args.shift()
  console.log(args);
  
  channelLog(EChannels.startGame, "receiving", args);
  appState.lock = true;
  channelLog(EChannels.lock, "sending", true);
  win.webContents.send(EChannels.playing, true);
  //start game is async
  startGame(name, args).then(() => {
    appState.lock = false;
    channelLog(EChannels.lock, "sending", false);
    store.set(name + "Started", true)
    win.webContents.send(EChannels.playing, false);
  });
});

ipcMain.on(EChannels.setupLegacy, () => {
  setUpLegacy()
  setupConfig()
  if(store.get('loadedGame')==='none'){
    store.set('loadedGame', 'legacy')
  }
});

// ipcMain.on(EChannels.checkInstall, (_, name: EGameNames) => {
//   const isInstalled = checksForInstall(name)
//   win.webContents.send(EChannels.checkInstall, {name, isInstalled});
// });

ipcMain.on(EChannels.unInstallPath, (_, name: EGameNames)=>{
  console.log("UNINSTALL", name);
  
  const altGame = {
    legacy: EGameNames.evrima,
    evrima: EGameNames.legacy
  }
  store.delete(name+"InstallPath" as 'evrimaInstallPath' | 'legacyInstallPath')
  const isLoadedGame = name === store.get('loadedGame')
  if(isLoadedGame && store.get(altGame[name]+"Install")){ 
    store.set('loadedGame', altGame[name])
    swapVersion(altGame[name])
    store.delete(`${name}Install`)
  }
})

ipcMain.handle(EChannels.changeInstallPath, async (_, data)=> {
  const path = (await dialog.showOpenDialog({defaultPath, properties: ['openDirectory'] })).filePaths[0]
  const [game] = data
  const previousPath = store.get(game+"InstallPath") as string
  const isInstalled = updatePath(game, path)
  const storeIsInstalled = game + "Install" as "legacyInstall" | "evrimaInstall"
  if(!isInstalled){
  store.set(game + "InstallPath", previousPath ?? "")
  updatePath(game, previousPath)
  }else{
    store.set(game + "InstallPath", path)
  }
  
  store.set(storeIsInstalled, isInstalled)

  //update default path
  defaultPath = path.split('\\').slice(0, -1).join('\\')

  return [isInstalled, path]
})

ipcMain.handle(EChannels.openDialog, ()=>{
 const selection = dialog.showOpenDialog({defaultPath: `C:\\`, properties: ['openDirectory'] })
 return selection
})

ipcMain.on(EChannels.lock, (_, args) => {
  console.log("test", args);
  setTimeout(() => {
    getWin().webContents.send("lock", args);
  }, 2000);
});
