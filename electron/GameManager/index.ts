import fs, {} from 'fs'
import { execFile } from 'child_process';
import { EGameNames } from 'Shared/gamenames';
import {store} from '../main/store';

export const LOCAL_APP_DATA = process.env.LOCALAPPDATA;

export const config = {
    steam: {
      path: 'C:\\Program Files (x86)\\Steam',
    },
    legacy: {
      path: '',
      name: 'TheIsle.exe',
      installIndicator: 'Engine\\Extras\\Redist\\en-us\\UE4PrereqSetup_x64.exe',
      storeName: "legacyInstallPath"
    },
    evrima: {
      path: '',
      name: 'TheIsle\\Binaries\\Win64\\TheIsleClient-Win64-Shipping.exe',
      installIndicator: 'EasyAntiCheat',
      storeName: "evrimaInstallPath"
    }
}

function checkGamePath(name: EGameNames){
  const game = config[name];
  game.path = store.get(game.storeName)
}

export function checksForInstall(name: EGameNames){
  checkGamePath(name)
  const game = config[name];
  return fs.existsSync(game.path) && fs.existsSync(`${game.path}\\${game.installIndicator}`)
}


export function setUpLegacy(){

  // Check Game Path and install
  const isInstalled = checksForInstall(EGameNames.legacy)
  store.set("legacyInstall", isInstalled)
  if(isInstalled){
    const game = config[EGameNames.legacy];
    const pathArray = game.path.split("\\")
    if(pathArray[pathArray.length - 1] === "The Isle"){
      const newFolderName = game.path + " Legacy"
      fs.renameSync(game.path, newFolderName)
      store.set("legacyInstallPath", newFolderName)
      game.path = newFolderName
    }
    fs.writeFileSync(`${game.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`, '376210')
  }
  return isInstalled
}

export function startGame(name: EGameNames, args: string[]){
    const game = config[name];
    const gameExe = `${game.path}\\${game.name}`;
    // return a promise after 5 secs for testing
    console.log("start game");
    
    return new Promise((resolve) => {
      execFile(gameExe, args, ()=> {        
        setTimeout(() => {
          resolve('game ended');
        }, 5000);
      });
    })
}