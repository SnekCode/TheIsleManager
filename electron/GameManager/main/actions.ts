import { ipcMain } from "electron";
import { getWin, win } from "~/electron/main/main";
import Store from "electron-store";
import {
  startGame,
  checksForInstall,
  setUpLegacy,
} from "../index";
import { EChannels, channelLog } from "Shared/channels";
import { EGameNames } from "Shared/gamenames";

const store = new Store();
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

ipcMain.on(EChannels.lock, (_, args) => {
  console.log("test", args);
  setTimeout(() => {
    getWin().webContents.send("lock", args);
  }, 2000);
});
