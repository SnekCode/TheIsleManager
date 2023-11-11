import { EGameNames } from "./gamenames";

export interface IStore {
  "state": string,
  "loadedGame": EGameNames,
}

// dynamic enum of IStore keys
export type TStoreKeys = keyof IStore;