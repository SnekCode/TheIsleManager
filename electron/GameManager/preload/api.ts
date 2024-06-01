import { contextBridge, ipcMain, ipcRenderer } from "electron";
import { withPrototype } from "~/electron/preload/preload";
import {EChannels, IChannelKeys, IChannelReceive, IChannelSend} from '~/Shared/channels';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "api",
  withPrototype({
    send: (channel: string, data: any) => {
      console.debug("MAIN SEND")
      ipcRenderer.send(channel, data);
    },
    receive: (channel: string, func: Function) => {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (_, ...args) => func(...args));
    },
    clearListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel);
    },
    invoke: async (channel: string, data: any, func: Function) => {
      const result = await ipcRenderer.invoke(channel, data)
      func(result)
      
    },
    retrieveFromStore: (name: string, func: Function) => {
      ipcRenderer.invoke("getStore", name).then((result) => func(result));
    },
    saveToStore: (name: string, data: any) => {
      ipcRenderer.invoke("setStore", name, data);
    },
  })
);