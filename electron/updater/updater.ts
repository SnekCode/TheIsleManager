import { ipcMain } from "electron";
import log from "electron-log/main";
import { autoUpdater } from "electron-updater";
import { win } from "Electron/main";
import { EChannels } from "~/Shared/channels";

autoUpdater.logger = log;
autoUpdater.autoDownload = false;

autoUpdater.checkForUpdates();

autoUpdater.on("update-available", () => {
  win.webContents.send(EChannels.updateAvailable, true);
  win.webContents.send(EChannels.updateInfo, autoUpdater.currentVersion);
});

autoUpdater.on("update-not-available", () => {
  win.webContents.send(EChannels.updateAvailable, false);
});

autoUpdater.on("update-downloaded", () => {
  win.webContents.send(EChannels.updateDownloaded);
});

autoUpdater.on("error", (info) => {
  win.webContents.send(EChannels.updateError, info);
});

autoUpdater.on("download-progress", (progress) => {
  win.webContents.send(EChannels.updateDownloadProgress, progress);
});

ipcMain.on(EChannels.update, (_, installNow: boolean) => {
  autoUpdater.downloadUpdate();
  if (installNow) {
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.autoRunAppAfterInstall = true;
    autoUpdater.once("update-downloaded", () => {
      autoUpdater.quitAndInstall();
    });
  } else {
    autoUpdater.autoInstallOnAppQuit = true;
  }
});