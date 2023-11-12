import fs from 'fs'
import { execFile } from 'child_process';
import { EGameNames } from 'Shared/gamenames';

const LOCAL_APP_DATA = process.env.LOCALAPPDATA;

type TGameNames = 'legacy' | 'evrima';

export const config = {
    steam: {
      path: 'C:\\Program Files (x86)\\Steam',
    },
    legacy: {
      path: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Isle Legacy',
      name: 'TheIsle.exe',
      runtimeAppDataName: 'TheIsle',
      thisStandbyAppDataName: 'TheIsleLegacy',
      otherStandbyAppDataName: 'TheIsleEvirma',
      installIndicator: 'Engine\\Extras\\Redist\\en-us\\UE4PrereqSetup_x64.exe',
    },
    evrima: {
      path: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Isle',
      name: 'TheIsle\\Binaries\\Win64\\TheIsleClient-Win64-Shipping.exe',
      runtimeAppDataName: 'TheIsle',
      thisStandbyAppDataName: 'TheIsleEvirma',
      otherStandbyAppDataName: 'TheIsleLegacy',
      installIndicator: 'EasyAntiCheat',
      isEvrimaAppDataFolderIndicator: 'Saved\\Config\\WindowsClient\\ApexDestruction.ini',
    }
}

export function setUpLegacy(){

  // confirm legacy is installed as evrima path
  if(fs.existsSync(config.evrima.path) && fs.existsSync(`${config.evrima.path}\\${config.legacy.installIndicator}`)){

    // game starts as legacy in steam we want to rename it so we can install evrima too
    fs.renameSync(config.evrima.path, config.legacy.path);
    // create a file to store steam id
    
    fs.writeFileSync(`${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`, '376210')
    // create a shortcut (symlink) named TheIsleLegacy on the OneDrive // desktop
    checkInAppData(EGameNames.legacy);
    return true
  }else if(checksForInstall('legacy')){
    if(fs.existsSync(`${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`)){
      fs.writeFileSync(`${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`, '376210')
    }
    // game is installed as legacy
    checkInAppData(EGameNames.legacy);
    return true
  }else {
    // game is not installed as legacy
    return false
  }
}

let attempts = 0;
let maxAttempts = 10;

export function checkInAppData(name: EGameNames){
    const game = config[name];
    if(fs.existsSync(`${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`)){
      return;
    }
    try{
      fs.renameSync(`${LOCAL_APP_DATA}\\${game.runtimeAppDataName}`, `${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`);
    }catch(e: any){
      if(e.code === 'EPERM' && attempts < maxAttempts){
        console.log('waiting for access', attempts);
        attempts++;
        setTimeout(() => {
          checkInAppData(name);
        }, 1000);
    }else {
      return;
    }
  }
}

export function checkOutAppData(name: TGameNames){
    const game = config[name];
    if(!fs.existsSync(`${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`)){
      return;
    }
    try{
    fs.renameSync(`${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`, `${LOCAL_APP_DATA}\\${game.runtimeAppDataName}`);
    }catch(e){

    }
}

export function swapVersion(name: TGameNames){
  const currentGame = checkCurrentAppDataFolderType();

  if( currentGame === name){
    return true;
  }else{
    checkInAppData(currentGame)
    checkOutAppData(name);
  }
  return checkCurrentAppDataFolderType() === name
}

export function checkCurrentAppDataFolderType(): EGameNames{
  return fs.existsSync(`${LOCAL_APP_DATA}\\${config.evrima.runtimeAppDataName}\\${config.evrima.isEvrimaAppDataFolderIndicator}`) ? EGameNames.evrima : EGameNames.legacy;
}


export function checksForInstall(name: TGameNames){
  return fs.existsSync(config[name].path) && fs.existsSync(`${config[name].path}\\${config[name].installIndicator}`)
}

export function startGame(name: TGameNames){
    const game = config[name];
    const gameExe = `${game.path}\\${game.name}`;
    //check for standbyAppData Folder
    swapVersion(name);
    // return a promise after 5 secs for testing
    return new Promise((resolve) => {
      execFile(gameExe, ()=> {
        setTimeout(() => {
          resolve('game ended');
        }, 5000);
      });
    })
}