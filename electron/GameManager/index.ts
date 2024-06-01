import fs, {} from 'fs'
import { execFile } from 'child_process';
import { EGameNames } from 'Shared/gamenames';
import {app} from 'electron'

const userData = app.getPath('userData')

export const LOCAL_APP_DATA = process.env.LOCALAPPDATA;

export const config = {
    path: `${LOCAL_APP_DATA}\\TheIsle`,
    steam: {
      path: 'C:\\Program Files (x86)\\Steam',
    },
    controlFiles: {
      settings: {
        path: 'Saved\\Config\\WindowsClient\\GameUserSettings.ini',
        savePath: `${userData}\\GameSettings`,
        legacyFlag: '[/Script/TheIsle.IGameUserSettings]',
        evrimaFlag: '[/Script/TheIsle.TIGameUserSettings]',
        legacySaveName: 'LegacyGameUserSettings.ini',
        evrimaSaveName: 'EvrimaGameUserSettings.ini'
      },
    },
    legacy: {
      path: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Isle Legacy',
      name: 'TheIsle.exe',
      installIndicator: 'Engine\\Extras\\Redist\\en-us\\UE4PrereqSetup_x64.exe'

    },
    evrima: {
      path: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Isle',
      name: 'TheIsle\\Binaries\\Win64\\TheIsleClient-Win64-Shipping.exe',
      installIndicator: 'EasyAntiCheat'
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
    // checkInAppData(EGameNames.legacy);
    return true
  }else if(checksForInstall(EGameNames.legacy)){
    if(fs.existsSync(`${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`)){
      fs.writeFileSync(`${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`, '376210')
    }
    // game is installed as legacy
    // checkInAppData(EGameNames.legacy);
    return true
  }else {
    // game is not installed as legacy
    return false
  }
}

// let attempts = 0;
// const maxAttempts = 10;

// export function checkInAppData(name: EGameNames){
//     const game = config[name];
//     if(fs.existsSync(`${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`)){
//       return;
//     }
//     try{
//       fs.renameSync(`${LOCAL_APP_DATA}\\${game.runtimeAppDataName}`, `${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     }catch(e: any){
//       if(e.code === 'EPERM' && attempts < maxAttempts){
//         console.log('waiting for access', attempts);
//         attempts++;
//         setTimeout(() => {
//           checkInAppData(name);
//         }, 1000);
//     }else {
//       console.log("something went wrong checking in");
//     }
//   }
// }

// export function checkOutAppData(name: EGameNames){
//     const game = config[name];
//     if(!fs.existsSync(`${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`)){
//       return;
//     }
//     const standByFileName = `${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`
//     const runTimeFileName = `${LOCAL_APP_DATA}\\${game.runtimeAppDataName}`
//     try{

//       fs.renameSync(standByFileName, runTimeFileName);
//     }catch (e){
//       console.log(standByFileName, runTimeFileName, e);
      
//       console.log("something went wrong checking out");
//     }
// }

function testControlFile(game: EGameNames, name: keyof typeof config.controlFiles){

  const controlFile = `${config.path}\\${config.controlFiles[name].path}`
  if(!fs.existsSync(controlFile)){
    return true;
  }
  const data = fs.readFileSync(controlFile).toString()
  // @ts-expect-error implicit string type error
  return data.includes(config.controlFiles[name][game + "Flag"])
}

function saveControlFile(game: EGameNames, name: keyof typeof config.controlFiles){
  console.log('saving', game, name);
  
  const path = `${config.path}\\${config.controlFiles[name].path}`
  // @ts-expect-error implicit string type error
  const newPath = `${config.controlFiles[name].savePath}\\${config.controlFiles[name][game + 'SaveName']}`
  fs.copyFileSync(path, newPath)
  return true;
}

function loadControlFile(game: EGameNames, name: keyof typeof config.controlFiles){
  console.log('loading', game, name);

  const path = `${config.path}\\${config.controlFiles[name].path}`
  // @ts-expect-error implicit string type error
  const newPath = `${config.controlFiles[name].savePath}\\${config.controlFiles[name][game + 'SaveName']}`
  try{
    fs.copyFileSync(newPath, path)
  }catch{
    fs.writeFileSync(path, "")
  }
  return true;
}

export function swapVersion(name: EGameNames){
  const currentGame = checkCurrentAppDataFolderType();
  console.log(currentGame);
  
  if(currentGame === "none"){
    // TODO Insert Control Files
    loadControlFile(name, 'settings')
    return [true, name];
  }

  if( currentGame === name){
    return [true, name];
  }else{
    // Swap Control Files
    saveControlFile(currentGame, 'settings')
    loadControlFile(name, 'settings')
    return [true, name]
  }
}

export function checkCurrentAppDataFolderType(): EGameNames | "none" {
  const isLegacy = testControlFile(EGameNames.legacy, "settings")
  const isEvrima = testControlFile(EGameNames.evrima, "settings")
  if(isLegacy && !isEvrima) return EGameNames.legacy
  if(isEvrima && !isLegacy) return EGameNames.evrima
  return "none"
}


export function checksForInstall(name: EGameNames){
  return fs.existsSync(config[name].path) && fs.existsSync(`${config[name].path}\\${config[name].installIndicator}`)
}

// export function checksForAppData(name: EGameNames){
//   const loadedGame = checkCurrentAppDataFolderType();
//   if(loadedGame === name){
//     return true;
//   }else{
//     return fs.existsSync(`${LOCAL_APP_DATA}\\${config[name].thisStandbyAppDataName}`)
//   }
// }

export function startGame(name: EGameNames, args: string[]){
    const game = config[name];
    const gameExe = `${game.path}\\${game.name}`;
    //check for standbyAppData Folder
    swapVersion(name);
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