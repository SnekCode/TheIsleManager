// provider that provides the app lock state and methods to lock/unlock the app

import ContextType from "@/Data/Interfaces/ContextType";
import { useApiReceiveEffect, useApiRetrieve } from "@/Hooks/useApi";
import React, { useEffect, useState } from "react";
import { EGameNames } from "~/Shared/gamenames";

interface IAppLockContext extends ContextType {
  lock: boolean;
  loadedGame: EGameNames
  playing: boolean;
  setLock: (lock: boolean) => void;
  setLoadedGame: (game: EGameNames) => void;
}

export const AppGameContext = React.createContext<IAppLockContext>({
  lock: false,
  loadedGame: EGameNames.legacy,
  playing: false,
  setLock: (_) => null,
  setLoadedGame: (_:EGameNames) => null,
});

export const AppGameProvider: React.FC<ContextType> = ({ children }) => {
  const [lock, setLock] = useState(false);
  const [loadedGame, setLoadedGame] = useState<EGameNames>(EGameNames.legacy);
  const [playing, setPlaying] = useState(false);
  const [loadedStore, setLoadedStore] = useState(false);

  useEffect(() => {
    useApiRetrieve("loadedGame", setLoadedGame);
    setLoadedStore(true);
  },[])


  useApiReceiveEffect("lock", setLock);
  useApiReceiveEffect("playing", setPlaying)

  if (!loadedStore && loadedGame === undefined) {
    return null;
  }


  return (
    <AppGameContext.Provider value={{ lock, setLock, loadedGame, setLoadedGame, playing }}>
      {children}
    </AppGameContext.Provider>
  );
};
