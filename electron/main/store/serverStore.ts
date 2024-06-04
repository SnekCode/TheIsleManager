import { IpcMainInvokeEvent, ipcMain } from 'electron';
import Store from 'electron-store';
import { IServerStore, IServerStoreKeys, } from '~/Shared/Store';

export const serverStore = new Store<IServerStore>({
    name: 'serverConfig',
	// beforeEachMigration: (_, context) => {
	// 	console.log(`[store] migrate from ${context.fromVersion} => ${context.toVersion}`);
	// },
	// migrations: {
	// 	'1.2.0': store => {
	// 		store.delete('legacyAppData');
	// 		store.delete('evrimaAppData');
	// 	}
	// }
});

ipcMain.handle('getServer', <K extends IServerStoreKeys>(_: IpcMainInvokeEvent, name: K): IServerStore[K] => {
  return serverStore.get(name);
});

ipcMain.handle('setServer', <K extends IServerStoreKeys>(_: IpcMainInvokeEvent, name: K, data: IServerStore[K]) => {
  serverStore.set(name, data);
});