import { ipcMain } from "electron";
import { getWin, win } from "~/electron/main/main";
import {store} from '../../main/store'
import {
  startGame,
  checksForInstall,
  setUpLegacy,
  updatePath
} from "../index";
import { EChannels, channelLog } from "Shared/channels";
import { EGameNames } from "Shared/gamenames";

const appState = {
  lock: false,
};

// set first run
if (store.get("state") === undefined) {
  store.set("state", "init");
}

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
    win.webContents.send(EChannels.playing, false);
  });
});

ipcMain.on(EChannels.setupLegacy, () => {
  if (appState.lock || win === null) {
    return;
  }
  win.webContents.send("hideMessage");
  console.log("setupLegacy");
if (setUpLegacy()) {
  } else {
    win.webContents.send(
      "showMessage",
      "Failed to setup legacy. No Install Found.  Please Install Legacy and try again."
    );
  }
  win.webContents.send("init", store.get("state"));
});

ipcMain.on(EChannels.checkInstall, (_, name: EGameNames) => {
  const isInstalled = checksForInstall(name)
  store.set(name+"InstallPath", isInstalled)
  win.webContents.send(EChannels.checkInstall, {name, isInstalled});
});

ipcMain.handle(EChannels.changeInstallPath, async (_, data)=> {
  const [game, path] = data
  console.log("MAIN CHANGEPATH", data)
  const previousPath = store.get(game+"InstallPath") as string
  console.log(previousPath, path, game);
  store.set(game+"InstallPath", path)
  const isInstalled = updatePath(game, path)
  console.log(isInstalled);
  
  if(!isInstalled){
  store.set(game + "InstallPath", previousPath)
  updatePath(game, previousPath)
  }

  // win.webContents.send(EChannels.changeInstallPath, isInstalled);
  return isInstalled
})

ipcMain.on(EChannels.lock, (_, args) => {
  console.log("test", args);
  setTimeout(() => {
    getWin().webContents.send("lock", args);
  }, 2000);
});
