// import fs from 'fs'
// import { execFile } from 'child_process';
const fs = require('fs');
const { execFile } = require('child_process');

const LOCAL_APP_DATA = process.env.LOCALAPPDATA;
const ONEDRIVE = process.env.ONEDRIVE;

// enum of game names
const gameNames = {
    legacy: 'legacy',
    evrima: 'evrima'
}

const config = {
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
    }
}

function setUpLegacy(){

  // confirm legacy is installed as evrima path
  if(fs.existsSync(config.evrima.path) && fs.existsSync(`${config.evrima.path}\\${config.legacy.installIndicator}`)){

    // game starts as legacy in steam we want to rename it so we can install evrima too
    fs.renameSync(config.evrima.path, config.legacy.path);
    // create a file to store steam id
    
    fs.writeFileSync(`${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`, '376210')
    // create a shortcut (symlink) named TheIsleLegacy on the OneDrive // desktop
    // fs.symlinkSync(`${config.legacy.path}\\${config.legacy.name}`, `${ONEDRIVE}\\Desktop\\The Isle - Legacy`, 'file')
    checkInAppData('legacy');
    return true
  }else if(checksForInstall('legacy')){
    if(fs.existsSync(`${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`)){
      fs.writeFileSync(`${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`, '376210')
    }
    // game is installed as legacy
    checkInAppData('legacy');
    return true
  }else {
    // game is not installed as legacy
    return false
  }
}

// function setUpEvrima(){
//     fs.symlinkSync(`${config.evrima.path}\\${config.evrima.name}`, `${ONEDRIVE}\\Desktop\\The Isle - Evrima`, 'file')
// }

let attempts = 0;
let maxAttempts = 10;

function checkInAppData(name){
    const game = config[name];
    console.log('checkInAppData', name);
    if(fs.existsSync(`${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`)){
      console.log('already checked in');
      return;
    }
    try{
      fs.renameSync(`${LOCAL_APP_DATA}\\${game.runtimeAppDataName}`, `${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`);
    }catch(e){
      if(e.code === 'EPERM' && attempts < maxAttempts){
        console.log('waiting for access', attempts);
        attempts++;
        setTimeout(() => {
          checkInAppData(name);
        }, 1000);
    }
  }
}

function checkOutAppData(name){
    const game = config[name];
    if(!fs.existsSync(`${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`)){
      console.log('already checked out');
      return;
    }
    try{
    fs.renameSync(`${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`, `${LOCAL_APP_DATA}\\${game.runtimeAppDataName}`);
    }catch(e){

    }
}

function swapVersion(name){
  if(name === 'legacy'){
    // first check if evrima is set
    checkInAppData('evrima');
    checkOutAppData('legacy');
  }else if (name === 'evrima'){
    // first check if legacy is setup
    checkInAppData('legacy');
    checkOutAppData('evrima');
  }
}

function checksForInstall(name){
  return fs.existsSync(config[name].path) && fs.existsSync(`${config[name].path}\\${config[name].installIndicator}`)
}

function startGame(name){
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

// export modules
module.exports = {
    checkOutAppData,
    checkInAppData,
    startGame,
    setUpLegacy,
    // setUpEvrima,
    gameNames,
    checksForInstall,
}