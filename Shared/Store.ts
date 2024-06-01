import { EGameNames } from "./gamenames";

export interface IStore {
  "state": "init" | "complete",
  "loadedGame": EGameNames | "none",
  "legacyInstall": boolean,
  "evrimaInstall": boolean,
  "legacyServers": string[],
  "evrimaServers": string[],
  "legacyInstallPath": string,
  "evrimaInstallPath": string
}

export type IStoreKeys = keyof IStore;