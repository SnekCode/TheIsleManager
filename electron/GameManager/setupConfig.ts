import { store } from "~/electron/main/store";
import {
  checkCurrentAppDataFolderType,
  checkOutAppData,
  checksForAppData,
  checksForInstall,
  LOCAL_APP_DATA,
} from ".";
import { EGameNames } from "~/Shared/gamenames";
import fs from "fs";
import path from "node:path";

// const loadedGame = checkCurrentAppDataFolderType();
// const legacyInstall = checksForInstall(EGameNames.legacy);
// const evrimaInstall = checksForInstall(EGameNames.evrima);
// const legacyAppData = checksForAppData(EGameNames.legacy);
// const evrimaAppData = checksForAppData(EGameNames.evrima);

// store.set("loadedGame", loadedGame);
// store.set("legacyInstall", legacyInstall);
// store.set("evrimaInstall", evrimaInstall);
// store.set("legacyAppData", legacyAppData);
// store.set("evrimaAppData", evrimaAppData);

// const DEBUG = store.get("DEBUG") ?? false;

// let gameRunning = false;

// const execCallback = (error: any, stdout: any, stderr: any) => {
//     if(error && DEBUG){
//       console.log(error);
//       }
//     if(stdout){
//       console.log(stdout);
//       setTimeout(() => gameRunning = false, 2000)
//       }
//     if(stderr && DEBUG){
//       console.log(stderr);
//       }
//     }