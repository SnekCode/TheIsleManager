import { ipcMain } from "electron";
import { getWin, win } from "Electron/main";
import Store from "electron-store";
import {
  startGame,
  checksForInstall,
  setUpLegacy,
  swapVersion,
} from "../../../GameManager/index";
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

const sendLock = () => {
  appState.lock = true;
  channelLog(EChannels.lock, "sending", true);
  win.webContents.send(EChannels.lock, true);
}

const sendUnlock = () => {
  appState.lock = false;
  channelLog(EChannels.lock, "sending", false);
  win.webContents.send(EChannels.lock, false);
}

ipcMain.on(EChannels.checkInstall, (_, arg: EGameNames) => {
  channelLog(EChannels.checkInstall, "receiving", arg);
  sendLock()
  const installed = checksForInstall(arg);
  sendUnlock()
  channelLog(EChannels.checkInstall, "sending", installed);
  win.webContents.send(EChannels.checkInstall, installed);
})

ipcMain.on(EChannels.configGame, (_, arg: EGameNames) => {
  channelLog(EChannels.configGame, "receiving", arg);
  if (appState.lock) {
    channelLog(EChannels.configGame, "sending", "failed", "app locked");
    win.webContents.send(EChannels.configGame, store.get("loadedGame"));
    return;
  }
  sendLock()
  const newVersion = swapVersion(arg);
    setTimeout(() => {
      sendUnlock()
      channelLog(EChannels.configGame, "sending", newVersion);
      win.webContents.send(EChannels.configGame, newVersion);
      store.set("loadedGame", newVersion);
    }, 1000);
});

ipcMain.on(EChannels.startGame, (_, arg) => {
  if (appState.lock) {
    return;
  }
  channelLog(EChannels.startGame, "receiving", arg);
  sendLock()
  win.webContents.send(EChannels.playing, true);
  //start game is async
  startGame(arg).then(() => {
    sendUnlock()
    win.webContents.send(EChannels.playing, false);
  });
});

ipcMain.on("setupLegacy", (_, __) => {
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

ipcMain.on("checkEvrima", (_, __) => {
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

ipcMain.on("stopCheckEvrima", (_, __) => {
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
