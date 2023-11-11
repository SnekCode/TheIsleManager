import App from '@/App'
import ContextType from '@/Data/Interfaces/ContextType'
import React from 'react'
import { AppGameProvider } from './AppGameProvider'

const AppProvider: React.FC<ContextType> = ({children}) => {
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