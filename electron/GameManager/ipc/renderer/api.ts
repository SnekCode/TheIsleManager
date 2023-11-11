import { contextBridge, ipcRenderer} from 'electron'


contextBridge.exposeInMainWorld('api', {
  configGame: (name: string) => {
    console.log('configGame', name);
    ipcRenderer.send('configGame', name);
  },
  startGame: (name: string) => {
    console.log('startGame');
    ipcRenderer.send('startGame', name);
  }
})