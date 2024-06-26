// create an electron menu
import { Menu, app, shell } from 'electron';
import path from 'node:path';
process.env.DIST = path.join(__dirname, '../dist')
import {store} from './store'
import { EGameNames } from '~/Shared/gamenames';
import fs from 'fs';
import {setupConfig} from '../GameManager/setupConfig';

const appData = process.env.LOCALAPPDATA ?? "";

// menu options

// Menu Bar
// ├─ App
// │  ├─ Close
// ├─ Help
// │  ├─ Check for Updates
// │  ├─ conditional apply update
// │  ├─ About
// ├─ Developer
// │  ├─ Toggle Dev Tools
// │  ├─ Toggle Server Side Dev Tools
// │  ├─ Open User Data Directory
// │  ├─ Open Log File
// │  ├─ Open Config File
// │  ├─ Open App Data Directory

const template: Electron.MenuItemConstructorOptions[] = [
   {
      label: 'App',
      submenu: [
         {
            label: 'Open Demo Folder',
            click: () => {
               const loadedGame: EGameNames = store.get('loadedGame') as EGameNames;
               const demoPath = path.join(appData, 'TheIsle', 'Saved', 'Demos')
               fs.existsSync(demoPath) || fs.mkdirSync(demoPath);
               console.log(loadedGame, demoPath);
               
               shell.openPath(demoPath);
            },
         },
         {
            label: 'Open App Data Directory',
            click: () => {
                shell.openPath(path.join(appData, "TheIsle"));
            }
         },
         {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close',
         },
      ],
   },
   {
    label: 'Settings',
    submenu: [
        {
           label: 'Change Game Paths',
           click: (_, focusedWindow) => {
            store.set('state', 'init')
            focusedWindow?.reload()
           }
         },
        ]
   },
   {
      label: 'Help',
      submenu: [
         {
            label: 'Check for Updates',
            click: () => null,
          },
          {
            label: 'About',
            click: () => null,
          },
      ],
    },
    {
      label: 'Developer',
      submenu: [
         //force reload
         {
            label: 'Force Reload',
            accelerator: 'CmdOrCtrl+Shift+R',
            click: (_, focusedWindow) => {
               if (focusedWindow) {
                  focusedWindow.reload();
               }
            },
         },
         {
            label: 'Force Window On Top',
            click:(_, focusedWindow) => {
                if(focusedWindow){
                    const alwaysOnTop = !focusedWindow.isAlwaysOnTop()
                    focusedWindow.setAlwaysOnTop(alwaysOnTop)
                    store.set('windowSettings', {alwaysOnTop})
                }
            }
         },
         {
            label: 'Toggle Dev Tools',
            accelerator: 'CmdOrCtrl+Shift+I',
            click: (_, focusedWindow) => {
               if (focusedWindow) {
                  focusedWindow.webContents.toggleDevTools();
               }
            },
         },
         {
            label: 'Open Application Data',
            click: () => {
               // get user data directory path
               // open in file explorer
               shell.openPath(appData);
               
            },
         },
         {
            label: 'Open Log File',
            click: () => {
               // get log file path
               // open in file explorer
               const logPath = app.getPath('logs');              
               shell.openPath(path.join(logPath, 'main.log'));
            },
         },
         {
            label: 'Open Config File',
            click: () => {
               //store config path
               //open in file explorer
               shell.openPath(store.path);
            },
         },
         {
            label: 'Reset App Configs',
            click: (_, focusedWindow) => {
                store.clear()
                setupConfig()
                // app.relaunch()
                focusedWindow?.reload()
                focusedWindow?.webContents.reload()
                focusedWindow?.webContents.reloadIgnoringCache()
                // app.quit()
            }
         }
      ],
    },
];

export function createMenu() {
    return Menu.buildFromTemplate(template)
  }