import {ProgressInfo} from 'electron-updater';
import {EGameNames} from './gamenames';

export enum EChannels {
  lock = 'lock',
  startGame = 'startGame',
  configGame = 'configGame',
  setupLegacy = 'setupLegacy',
  openDialog = 'openDialog',
  test = 'test',
  hideMessage = 'hideMessage',
  showMessage = 'showMessage',
  init = 'init',
  playing = 'playing',
  updateAvailable = 'updateAvailable',
  updateDownloaded = "updateDownloaded",
  updateError = "updateError",
  update = "update",
  updateDownloadProgress = "updateDownloadProgress",
  updateInfo = "updateInfo",
  // checkInstall = "checkInstall",
  changeInstallPath ="changeInstallPath",
  unInstallPath = "unInstallPath",
  loadedGame = "loadedGame"
}

export interface IChannelReceive {
  lock: (bool:boolean) => boolean
  loadedGame: () => EGameNames
  playing: (bool:boolean) => boolean
  // checkInstall: {name: EGameNames, isInstalled: boolean}
  changeInstallPath: (name:EGameNames, path: string) => [boolean, string]
  openDialog: ()=> any
  updateAvailable:  boolean
  updateDownloaded: boolean
  updateInfo: string
  updateDownloadProgress: ProgressInfo
}

export interface IChannelSend {
  // checkInstall: (name: EGameNames) => void
  unInstallPath: EGameNames
  update: boolean
  configGame: EGameNames
  setupLegacy: null
}

export interface IChannels {
  updateDownloadProgress: ProgressInfo
  updateInfo: (s:string)=>string
  updateDownloaded: (bool:boolean)=> boolean
  updateAvailable: (bool:boolean) => boolean
  lock: (bool:boolean)=> boolean
  loadedGame: () => EGameNames
  playing: (bool:boolean) => boolean
  // checkInstall: (name: EGameNames) => {name: EGameNames, isInstalled: boolean}
  changeInstallPath: (name:EGameNames, path: string) => [boolean, string]
  openDialog: ()=> any
  setUpConfig: ()=>void
  unInstallPath: EGameNames
}

export type IChannelKeys = keyof IChannels;

export const channelLog = (channel: string, direction: "sending"| "receiving", ...args: any[]) => {
  // formatted log direction on Channel: arg1, arg2, arg3 with color based on direction
  // recieving is green sending in yellow
  // if in browser log to console

  const isBrowser = typeof window !== "undefined";
  
  if (isBrowser) {
  const logDirection = direction === "sending" ? "sending" : "receiving";
  const logColor = direction === "sending" ? "color: yellow" : "color: green";
  const logArgs = args.map((arg) => {
    if (typeof arg === "object") {
      return JSON.stringify(arg);
    } else {
      return arg;
    }
  });
  console.log(`%c${logDirection} on ${channel}: ${logArgs.join(", ")}`, logColor);
}else{
  console.log(`${direction} on ${channel}: ${args.join(", ")}`);
}
}