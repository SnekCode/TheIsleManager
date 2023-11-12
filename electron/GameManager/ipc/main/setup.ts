import { ipcMain } from "electron";
import { EChannels } from "~/Shared/channels";
import { EGameNames } from "~/Shared/gamenames";

ipcMain.handle(EChannels.checkInstall, (_, arg: EGameNames) => {
  return false
})