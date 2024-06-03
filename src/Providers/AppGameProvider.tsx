// provider that provides the app lock state and methods to lock/unlock the app

import ContextType from "@/Data/Interfaces/ContextType";
import { useApiReceiveEffect, apiRetrieve, apiSave, apiSend } from "@/Hooks/useApi";
import React, { useEffect, useMemo, useState } from "react";
import { EGameNames } from "~/Shared/gamenames";
import {IStore} from '~/Shared/Store';

interface IAppLockContext extends ContextType {
  lock: boolean;
  loadedGame: EGameNames | "none"
  playing: boolean;
  loadedStore: boolean;
  setLock: (lock: boolean) => void;
  setLoadedGame: (game: EGameNames) => void;
  configState: "init" | "complete"
  saveConfigState: (value: IStore["state"]) => void
  bothGamesInstalled: boolean
}

export const AppGameContext = React.createContext<IAppLockContext>({
  lock: false,
  loadedGame: EGameNames.legacy,
  playing: false,
  loadedStore: false,
  setLock: () => null,
  setLoadedGame: () => null,
  configState: "init",
  saveConfigState: () => null,
  bothGamesInstalled: false
});

export const AppGameProvider: React.FC<ContextType> = ({ children }) => {
  const [configState, setConfigState] = useState<"init" | "complete">("init")
  const [lock, setLock] = useState(false);
  const [loadedGame, setLoadedGame] = useState<EGameNames | "none">(EGameNames.legacy);
  const [playing, setPlaying] = useState(false);
  const [loadedStore, setLoadedStore] = useState(false);
  const [legacyInstall, setLegacyInstall] = useState(false)
  const [evrimaInstall, setEvrimaInstall] = useState(false)


  useEffect(()=> {
    apiRetrieve('legacyInstall', setLegacyInstall)
    apiRetrieve('evrimaInstall', setEvrimaInstall)
    apiRetrieve('state', (data) =>{
      setConfigState(data)
    })
  }, [])

useEffect(()=>{
  apiRetrieve("loadedGame", (data) => {
    setLoadedGame(data)
    setLoadedStore(true);
  });
})

  useApiReceiveEffect("lock", setLock);
  useApiReceiveEffect("playing", setPlaying)

  const saveConfigState = (value: IStore["state"]) => {
    apiSend('setupLegacy', null)
    setConfigState(value)
    apiRetrieve('legacyInstall', setLegacyInstall)
    apiRetrieve('evrimaInstall', setEvrimaInstall)
    apiRetrieve('loadedGame', setLoadedGame)
    apiSave('state', value)

    if(loadedGame === 'none' && legacyInstall){
      apiSave("loadedGame", EGameNames.legacy)
    }else if (loadedGame === 'none' && evrimaInstall){
      apiSave("loadedGame", EGameNames.evrima)
    }

  }

  const providerValue = useMemo(() => ({
    lock, 
    setLock, 
    loadedGame, 
    setLoadedGame, 
    playing, 
    loadedStore, 
    configState, 
    saveConfigState,
    bothGamesInstalled: legacyInstall && evrimaInstall
  }as IAppLockContext), [lock, setLock, loadedGame, setLoadedGame, playing, loadedStore, configState, saveConfigState, legacyInstall, evrimaInstall]);

  if (!loadedStore) {
    return null;
  }
  
  return (
    <AppGameContext.Provider value={providerValue}>
      {children}
    </AppGameContext.Provider>
  );

};
