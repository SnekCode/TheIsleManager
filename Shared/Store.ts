import { EGameNames } from "./gamenames";

export interface IStore {
  "state": "init" | "complete",
  "loadedGame": EGameNames | "none",
  "legacyInstall": boolean,
  "evrimaInstall": boolean,
  "legacyServers": string[],
  "legacyStarted": boolean,
  "evrimaServers": string[],
  "evrimaStarted": boolean,
  "legacyInstallPath": string,
  "evrimaInstallPath": string,
  "evrimaAppData": void,
  "legacyAppData": void
}

export type IStoreKeys = keyof IStore;