import { ipcMain } from "electron";
import log from "electron-log/main";
import { autoUpdater } from "electron-updater";
import { win } from "Electron/main";
import { channelLog, EChannels } from "~/Shared/channels";

autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.forceDevUpdateConfig = true;

const isDev = process.env.NODE_ENV === "development";

const checkUpdates = () => {
  if(isDev) {
    return;
  }
  autoUpdater.checkForUpdates();
}

setTimeout(() => checkUpdates, 5000);

// check for updates every 1hour
setInterval(() => checkUpdates, 3600000);

autoUpdater.on("update-available", (info) => {
  channelLog("update-available", "receiving", info);
  win.webContents.send(EChannels.updateAvailable, true);
  win.webContents.send(EChannels.updateInfo, info.version);
});

autoUpdater.on("update-not-available", (args) => {
  channelLog("update-not-available", "receiving", args);
  win.webContents.send(EChannels.updateAvailable, false);
});

autoUpdater.on("update-downloaded", (args) => {
  channelLog("update-downloaded", "receiving", args);
  win.webContents.send(EChannels.updateDownloaded, true);
});

autoUpdater.on("error", (info) => {
  channelLog("update-error", "receiving", info);
  win.webContents.send(EChannels.updateError, info);
});

autoUpdater.on("download-progress", (progress) => {
  channelLog("download-progress", "receiving", progress);
  win.webContents.send(EChannels.updateDownloadProgress, progress);
});

ipcMain.on(EChannels.update, (_, installNow: boolean) => {
  autoUpdater.downloadUpdate().then(() => {
    if (installNow) {
      console.log("installing update now");
      autoUpdater.quitAndInstall(true, true);
    } else {
      console.log("installing update on quit");
      autoUpdater.autoInstallOnAppQuit = true;
    }
  });
});
