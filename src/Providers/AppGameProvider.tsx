// provider that provides the app lock state and methods to lock/unlock the app

import ContextType from "@/Data/Interfaces/ContextType";
import { useApiReceiveEffect, apiRetrieve, apiSave } from "@/Hooks/useApi";
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

  useEffect(() => {
    apiRetrieve("loadedGame", (data) => {
      setLoadedGame(data)
      setLoadedStore(true);
    });
    apiRetrieve('state', (data) =>{
      setConfigState(data)
    })
  },[])


  useApiReceiveEffect("lock", setLock);
  useApiReceiveEffect("playing", setPlaying)

  const saveConfigState = (value: IStore["state"]) => {
    apiSave('state', value)
    setConfigState(value)
  }

  const providerValue = useMemo(() => ({
    lock, 
    setLock, 
    loadedGame, 
    setLoadedGame, 
    playing, 
    loadedStore, 
    configState, 
    saveConfigState
  }), [lock, setLock, loadedGame, setLoadedGame, playing, loadedStore, configState, saveConfigState]);

  if (!loadedStore) {
    return null;
  }
  
  return (
    <AppGameContext.Provider value={providerValue}>
      {children}
    </AppGameContext.Provider>
  );

};
