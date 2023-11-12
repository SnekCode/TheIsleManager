import { ipcMain } from 'electron';
import Store from 'electron-store';

export const store = new Store();

ipcMain.handle('getStore', (_, name) => {
  return store.get(name);
});

ipcMain.handle('setStore', (_, name, data) => {
  store.set(name, data);
});