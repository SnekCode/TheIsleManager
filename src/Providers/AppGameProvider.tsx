// provider that provides the app lock state and methods to lock/unlock the app

import ContextType from "@/Data/Interfaces/ContextType";
import { useApiReceiveEffect, apiRetrieve } from "@/Hooks/useApi";
import React, { useEffect, useState } from "react";
import { EGameNames } from "~/Shared/gamenames";

interface IAppLockContext extends ContextType {
  lock: boolean;
  loadedGame: EGameNames | "none"
  playing: boolean;
  loadedStore: boolean;
  setLock: (lock: boolean) => void;
  setLoadedGame: (game: EGameNames) => void;
}

export const AppGameContext = React.createContext<IAppLockContext>({
  lock: false,
  loadedGame: EGameNames.legacy,
  playing: false,
  loadedStore: false,
  setLock: () => null,
  setLoadedGame: () => null,
});

export const AppGameProvider: React.FC<ContextType> = ({ children }) => {
  const [lock, setLock] = useState(false);
  const [loadedGame, setLoadedGame] = useState<EGameNames | "none">(EGameNames.legacy);
  const [playing, setPlaying] = useState(false);
  const [loadedStore, setLoadedStore] = useState(false);

  useEffect(() => {
    apiRetrieve("loadedGame", (data) => {
      setLoadedGame(data)
      setLoadedStore(true);
    });
  },[])


  useApiReceiveEffect("lock", setLock);
  useApiReceiveEffect("playing", setPlaying)

  if (!loadedStore) {
    return null;
  }


  return (
    <AppGameContext.Provider value={{ lock, setLock, loadedGame, setLoadedGame, playing, loadedStore }}>
      {children}
    </AppGameContext.Provider>
  );
};
