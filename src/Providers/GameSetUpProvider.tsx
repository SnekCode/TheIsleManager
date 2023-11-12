// a provider that communicates with the main process via ipc to determine state of game installs

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApiInvoke } from '@/Hooks/useApi';
import ContextType from '@/Data/Interfaces/ContextType';
import { EGameNames } from '~/Shared/gamenames';
import { AppSetupContext } from './AppProvider';
import { EChannels } from '~/Shared/channels';

interface GameSetUpContextType extends ContextType {
  evrimaSetup: boolean;
  legacySetup: boolean;
};

export const GameSetUpContext = createContext<GameSetUpContextType>({
  evrimaSetup: false,
  legacySetup: false,
});

const GameSetUpProvider: React.FC<ContextType> = ({ children }) => {
  const {setLoading} = useContext(AppSetupContext)
  const [evrimaSetup, setEvrimaSetup] = useState(false);
  const [legacySetup, setLegacySetup] = useState(false);

  useApiInvoke(EChannels.checkInstall, EGameNames.legacy, (isLegacySetup: boolean) => {
    setLegacySetup(isLegacySetup);
  });

  useApiInvoke(EChannels.checkInstall, EGameNames.evrima, (isEvrimaSetup: boolean) => {
    setEvrimaSetup(isEvrimaSetup);
  });

  useEffect(() => {
    if (evrimaSetup && legacySetup) {
      setLoading(false);
    }
  }, [evrimaSetup, legacySetup])

  return (
    <GameSetUpContext.Provider
      value={{
        evrimaSetup,
        legacySetup,
      }}
    >
      ...setting up
    </GameSetUpContext.Provider>
  );
};

// export memoized provider
export const MemoizedGameSetUpProvider = React.memo(GameSetUpProvider);