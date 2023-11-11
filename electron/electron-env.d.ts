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
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  api: {
    send: (channel: string, data: any) => void
    receive: (channel: string, func: Function) => void
    clearListeners: (channel: string) => void
    retrieveFromStore: (name: string, func: Function) => void
    saveToStore: (name: string, data: any) => void
  }
  init: {
    setupLegacy: () => void
  }
  test: {
    test: () => void
  }
  lock: boolean
}
