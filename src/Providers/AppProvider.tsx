import App from '@/App'
import ContextType from '@/Data/Interfaces/ContextType'
import React from 'react'
import { AppGameProvider } from './AppGameProvider'
import { GameSetUpProvider } from './GameSetUpProvider'

interface IAppSetupProvider extends ContextType {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

// create context for app state
export const AppSetupContext = React.createContext<IAppSetupProvider>({
  setLoading: () => {},
})

const AppProvider: React.FC<ContextType> = ({children}) => {
  const [loading, setLoading] = React.useState(true)

  if (loading) {
    return (
      <AppSetupContext.Provider value={{setLoading}}>
        <GameSetUpProvider/>
      </AppSetupContext.Provider>
    )
  }

  return (
    <>
      <AppGameProvider>
        <App/>
      </AppGameProvider>
      {children}
    </>
  )
}

export default AppProvider