import { ipcMain } from "electron";
import { getWin, win } from "~/electron/main/main";
import Store from "electron-store";
import {
  startGame,
  checksForInstall,
  setUpLegacy,
  swapVersion,
  config,
} from "../index";
import { EChannels, channelLog } from "Shared/channels";
import { EGameNames } from "Shared/gamenames";

import { execFile } from 'child_process';


const store = new Store();
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
    appState.lock = false;
    setTimeout(() => {
      channelLog(EChannels.lock, "sending", false);
      win.webContents.send(EChannels.lock, false);
      channelLog(EChannels.configGame, "sending", gameName);
      win.webContents.send(EChannels.configGame, gameName);
      store.set("loadedGame", gameName);
    }, 1000);
  }else{
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
    win.webContents.send(EChannels.playing, false);
  });
});

ipcMain.on("setupLegacy", () => {
  if (appState.lock || win === null) {
    return;
  }
  win.webContents.send("hideMessage");
  console.log("setupLegacy");
  if (checksForInstall(EGameNames.legacy)) {
    store.set("legacy", "complete");
    store.set("state", EGameNames.evrima);
  } else if (setUpLegacy()) {
    store.set("state", EGameNames.evrima);
    store.set("legacy", "complete");
  } else {
    win.webContents.send(
      "showMessage",
      "Failed to setup legacy. No Install Found.  Please Install Legacy and try again."
    );
  }
  win.webContents.send("init", store.get("state"));
});

let installCheck: NodeJS.Timeout | null = null;

function checkForEvrima() {
  if (win === null) {
    return false;
  }
  if (checksForInstall(EGameNames.evrima)) {
    win.webContents.send("init", "complete");
    store.set("state", "complete");
    // setUpEvrima();
    return true;
  } else {
    return false;
  }
}

ipcMain.on("checkEvrima", () => {
  if (appState.lock || win === null) {
    return;
  }
  // check for legacy install
  if (!checksForInstall(EGameNames.legacy)) {
    store.set("state", "init");
    win.webContents.send("init", "init");
    return;
  }
  if (!checkForEvrima()) {
    installCheck = setInterval(checkForEvrima, 10000);
  }
});

ipcMain.on("stopCheckEvrima", () => {
  if (installCheck !== null) {
    clearInterval(installCheck);
  }
});

ipcMain.on(EChannels.lock, (_, args) => {
  console.log("test", args);
  setTimeout(() => {
    getWin().webContents.send("lock", args);
  }, 2000);
});
