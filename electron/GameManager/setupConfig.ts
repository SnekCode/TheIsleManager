import {store} from '~/electron/main/store'
import { checkCurrentAppDataFolderType, checkOutAppData, checksForAppData, checksForInstall, LOCAL_APP_DATA } from '.'
import { EGameNames } from '~/Shared/gamenames'
import fs from 'fs'
import path from 'node:path'

const loadedGame = checkCurrentAppDataFolderType();
const legacyInstall = checksForInstall(EGameNames.legacy);
const evrimaInstall = checksForInstall(EGameNames.evrima);
const legacyAppData = checksForAppData(EGameNames.legacy);
const evrimaAppData = checksForAppData(EGameNames.evrima);

store.set('loadedGame', loadedGame);
store.set('legacyInstall', legacyInstall);
store.set('evrimaInstall', evrimaInstall);
store.set('legacyAppData', legacyAppData);
store.set('evrimaAppData', evrimaAppData);

if(store.store.loadedGame === 'none' && store.store.legacyInstall && store.store.legacyAppData){
  checkOutAppData(EGameNames.legacy)
  store.set('loadedGame', EGameNames.legacy)
  store.store.loadedGame = EGameNames.legacy
}

// check for spelling mistakes for evrima spelled: evirma 
if(LOCAL_APP_DATA && fs.existsSync(path.join(LOCAL_APP_DATA, 'TheIsleEvirma'))){
  fs.renameSync(path.join(LOCAL_APP_DATA, 'TheIsleEvirma'), path.join(LOCAL_APP_DATA, 'TheIsleEvrima'))
}

// if appdata installs are false create the appdata folders for the game
if(LOCAL_APP_DATA && !store.store.legacyAppData){
  fs.mkdirSync(path.join(LOCAL_APP_DATA, 'TheIsle'))
  store.set('loadedGame', EGameNames.legacy)
  store.store.loadedGame = EGameNames.legacy
  store.set('legacyAppData', true)
  store.store.legacyAppData = true
}

if(LOCAL_APP_DATA && !store.store.evrimaAppData){
  fs.mkdirSync(path.join(LOCAL_APP_DATA, 'TheIsleEvrima'))
  store.set('evrimaAppData', true)
  store.store.evrimaAppData = true
}