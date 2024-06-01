import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import AppProvider from 'Providers/AppProvider'
import {EChannels} from '~/Shared/channels'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})

window.ipcRenderer.on(EChannels.checkInstall, (event,message)=>{
  console.log(EChannels.checkInstall, event,message);
})

window.ipcRenderer.on(EChannels.changeInstallPath, (event,message)=>{
  console.log(EChannels.changeInstallPath, event,message);
})