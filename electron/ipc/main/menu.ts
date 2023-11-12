// create an electron menu
import { Menu, app, shell } from 'electron';
import path from 'node:path';
process.env.DIST = path.join(__dirname, '../dist')
import {store} from './store'
import { getAppDataFolder } from '../../GameManager/index';
import { EGameNames } from '~/Shared/gamenames';
import fs from 'fs';

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
               const demoPath = path.join(getAppDataFolder(loadedGame), 'Saved', 'Demos')
               fs.existsSync(demoPath) || fs.mkdirSync(demoPath);
               console.log(loadedGame, demoPath);
               
               shell.openPath(demoPath);
            },
         },
         {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close',
         },
      ],
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
               const userDataPath = app.getPath('userData');
               shell.openPath(userDataPath);
               
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
            label: 'Open App Data Directory',
            submenu: [
               {
                  label: 'Evrima',
                  click: () => {
                     shell.openPath(getAppDataFolder("evrima"));
                  }
               },
               {
                  label: 'Legacy',
                  click: () => {
                     shell.openPath(getAppDataFolder("legacy"));
                  }
               },
            ]
         },
      ],
    },
];


export function createMenu() {
  return Menu.buildFromTemplate(template)
}
