/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string
    DIST_ELECTRON: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
    VSCODE_DEBUG?: true
    VITE_UPDATER: boolean
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  api: {
    send: (channel: string, data: any) => void
    receive: (channel: string, func: Function) => void
    clearListeners: (channel: string) => void
    invoke: (channel: string, data: any, func: Function) => void
    retrieveFromStore: (name: string, func: Function) => void
    saveToStore: (name: string, data: any) => void
    retrieveFromServerStore: (name: string, func: Function) => void
    saveToServerStore: (name: string, data: string) => void
  }
  init: {
    setupLegacy: () => void
  }
  test: {
    test: () => void
  }
  lock: boolean
}
