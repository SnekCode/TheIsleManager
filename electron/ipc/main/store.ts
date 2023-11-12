import { ipcMain } from 'electron';
import Store from 'electron-store';

const store = new Store();

// config init values
// loaded game
if (store.get('loadedGame') !== 'legacy' || store.get('loadedGame') !== 'evrima') {
  store.set('loadedGame', 'legacy');
}

ipcMain.handle('getStore', (_, name) => {
  return store.get(name);
});

ipcMain.handle('setStore', (_, name, data) => {
  store.set(name, data);
});