import { EGameNames } from "./gamenames";

export interface IStore {
  "state": string,
  "loadedGame": EGameNames | "none",
  "legacyInstall": boolean,
  "evrimaInstall": boolean,
  "legacyAppData": boolean,
  "evrimaAppData": boolean
}

export type IStoreKeys = keyof IStore;