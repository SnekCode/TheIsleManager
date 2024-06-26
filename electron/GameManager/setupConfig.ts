import { store } from "~/electron/main/store";
import {
  checkCurrentAppDataFolderType,
} from ".";
import { EGameNames } from "~/Shared/gamenames";
import fs from "fs";
import {app} from 'electron'


export function setupConfig(){
  const userData = app.getPath('userData')

  // Added in Version 1.2.0 to create a folder in userData `AppData\Roaming\theislemanager\GameSettings` to store game config files
  if(!fs.existsSync(`${userData}\\GameSettings`)){
    fs.mkdirSync(`${userData}\\GameSettings`)
  }

  if(!store.has('state')){
    store.set('state', 'init')
  }
  const loadedGame = checkCurrentAppDataFolderType();
  const legacyInstall = fs.existsSync(store.get('legacyInstallPath'))
  const evrimaInstall = fs.existsSync(store.get('evrimaInstallPath'))

  store.set("loadedGame", loadedGame);
  store.set("legacyInstall", legacyInstall);
  store.set("evrimaInstall", evrimaInstall);

  // const DEBUG = store.get("DEBUG") ?? false;

  if (
    store.store.loadedGame === "none" &&
    store.store.legacyInstall
  ) {
    store.set("loadedGame", EGameNames.legacy);
    store.store.loadedGame = EGameNames.legacy;
  }

  if (
    store.store.loadedGame === "none" &&
    store.store.evrimaInstall
  ) {
    store.set("loadedGame", EGameNames.evrima);
    store.store.loadedGame = EGameNames.evrima;
  }
}