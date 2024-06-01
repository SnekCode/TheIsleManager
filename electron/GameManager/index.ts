import fs, {} from 'fs'
import { execFile } from 'child_process';
import { EGameNames } from 'Shared/gamenames';
import {app} from 'electron'
import {store} from '../main/store'

const userData = app.getPath('userData')

export const LOCAL_APP_DATA = process.env.LOCALAPPDATA;

const legacyFolderName = "The Isle - Legacy"

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
      path: store.get('legacyInstallPath'),
      name: 'TheIsle.exe',
      installIndicator: 'Engine\\Extras\\Redist\\en-us\\UE4PrereqSetup_x64.exe'

    },
    evrima: {
      path: store.get('evrimaInstallPath'),
      name: 'TheIsle\\Binaries\\Win64\\TheIsleClient-Win64-Shipping.exe',
      installIndicator: 'EasyAntiCheat'
    }
}

export function setUpLegacy(){

    if(!config.legacy.path.includes(legacyFolderName)){
      const dirArr = config.legacy.path.split('\\')
      dirArr[dirArr.length - 1] = legacyFolderName
      const newPath = dirArr.join('\\')

      fs.renameSync(config.legacy.path, newPath);
      config.legacy.path = newPath
      store.set('legacyInstallPath', newPath)
      // create a file to store steam id
      fs.writeFileSync(`${newPath}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`, '376210')
    }
}

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

export function updatePath(name:EGameNames, path:string){
  config[name].path = path
  return checksForInstall(name)
}


export function checksForInstall(name: EGameNames){
  return fs.existsSync(config[name].path) && fs.existsSync(`${config[name].path}\\${config[name].installIndicator}`)
}


export function startGame(name: EGameNames, args: string[]){
    const game = config[name];
    const gameExe = `${game.path}\\${game.name}`;
    // return a promise after 5 secs for testing
    console.log("start game");
    
    return new Promise((resolve) => {
      execFile(gameExe, args, ()=> {        
        setTimeout(() => {
          saveControlFile(name, 'settings')
          console.log("saving game settings");
          resolve('game ended');
        }, 5000);
      });
    })
}