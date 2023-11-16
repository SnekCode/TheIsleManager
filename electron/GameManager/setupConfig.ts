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

const loadedGame = checkCurrentAppDataFolderType();
const legacyInstall = checksForInstall(EGameNames.legacy);
const evrimaInstall = checksForInstall(EGameNames.evrima);
const legacyAppData = checksForAppData(EGameNames.legacy);
const evrimaAppData = checksForAppData(EGameNames.evrima);

store.set("loadedGame", loadedGame);
store.set("legacyInstall", legacyInstall);
store.set("evrimaInstall", evrimaInstall);
store.set("legacyAppData", legacyAppData);
store.set("evrimaAppData", evrimaAppData);

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

// const startGameForConfig = (name: EGameNames) => {
//   const game = config[name];
//   const gameExe = `${game.path}\\${game.name}`;
//   const runningGame = execFile(gameExe);
//   gameRunning = true;

//   console.log("PID: ", runningGame.pid);

  // while (gameRunning) {
  //   if (fs.existsSync(`${LOCAL_APP_DATA}\\${game.runtimeAppDataName}\\Saved\\Config\\WindowsClient\\Engine.ini`)) {
  //     exec('taskkill /IM TheIsleClient-Win64-Shipping.exe /F /T', execCallback) 
  //     exec(`taskkill /IM TheIsle.exe /F /T`, execCallback);
  //     exec('taskkill /PID ' + runningGame.pid + ' /T /F', execCallback);
  //   }
  // }

  // setTimeout(() => {
  //   exec('taskkill /IM TheIsleClient-Win64-Shipping.exe /F /T', execCallback) 
  //   exec(`taskkill /IM TheIsle.exe /F /T`, execCallback);
  //   exec('taskkill /PID ' + runningGame.pid + ' /T /F', execCallback);
  //   gameRunning = false;
  //   runningGame.kill();
  // }, gameRuntTime[name]);
// 
// }

// const waitForGame = (name: EGameNames, callforward: () => void, callback?: ()=> void) => {
//   if (gameRunning) {
//     setTimeout(() => waitForGame(name, callforward), 5000);
//   } else {
//     console.log("starting game: ", name, "for setup");
//     callforward();
//     startGameForConfig(name);
//     if(callback){
//       callback();
//     }
//   }
// };

if (
  store.store.loadedGame === "none" &&
  store.store.legacyInstall &&
  store.store.legacyAppData
) {
  checkOutAppData(EGameNames.legacy);
  store.set("loadedGame", EGameNames.legacy);
  store.store.loadedGame = EGameNames.legacy;
}

// check for spelling mistakes for evrima spelled: evirma
if (
  LOCAL_APP_DATA &&
  fs.existsSync(path.join(LOCAL_APP_DATA, "TheIsleEvirma"))
) {
  fs.renameSync(
    path.join(LOCAL_APP_DATA, "TheIsleEvirma"),
    path.join(LOCAL_APP_DATA, "TheIsleEvrima")
  );
}

// if appdata installs are false create the appdata folders for the game
// if (LOCAL_APP_DATA && !store.store.legacyAppData) {
//   waitForGame(EGameNames.legacy, () => {
//     checkOutAppData(EGameNames.evrima);
//   });
// }

// if (LOCAL_APP_DATA && !store.store.evrimaAppData) {
//   waitForGame(EGameNames.evrima, () => {
//     checkInAppData(EGameNames.legacy);
//   },
//   () => {
//     setTimeout(() => checkOutAppData(EGameNames.evrima), 2000);
//   })
// }