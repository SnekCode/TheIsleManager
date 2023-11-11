import { ipcMain } from 'electron';
import Store from 'electron-store';

const store = new Store();

console.log(store.path);


ipcMain.handle('getStore', (_, name) => {
  return store.get(name);
});

ipcMain.handle('setStore', (_, name, data) => {
  store.set(name, data);
});