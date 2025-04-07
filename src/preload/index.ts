import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  close: () => electronAPI.ipcRenderer.send('close'),
  minimize: () => electronAPI.ipcRenderer.send('minimize'),
  maximize: () => electronAPI.ipcRenderer.send('maximize'),
  isMaximized: () => electronAPI.ipcRenderer.sendSync('isMaximized'),
  getWindowPos: () => electronAPI.ipcRenderer.sendSync('getWindowPos'),
  setWindowPos: (x: number, y: number) => electronAPI.ipcRenderer.send('setWindowPos', { x, y }),
  getTitle: () => electronAPI.ipcRenderer.sendSync('getTitle'),
  createFile: (path: string, content: string) =>
    electronAPI.ipcRenderer.invoke('createFile', path, content),
  fileExists: (path: string) => electronAPI.ipcRenderer.sendSync('fileExists', path),
  createDir: (path: string) => electronAPI.ipcRenderer.invoke('createDir', path),
  readFile: (path: string) => electronAPI.ipcRenderer.invoke('readFile', path),
  deletePath: (path: string) => electronAPI.ipcRenderer.invoke('deletePath', path),
  readDir: (path: string) => electronAPI.ipcRenderer.invoke('readDir', path),
  rename: (path: string, distPath: string) =>
    electronAPI.ipcRenderer.invoke('rename', path, distPath),
  getDocPath: () => electronAPI.ipcRenderer.sendSync('getDocPath'),
  pathPush: (path: string, distPath: string) =>
    electronAPI.ipcRenderer.sendSync('pathPush', path, distPath),
  pathBasename: (path: string, suffix?: string) =>
    electronAPI.ipcRenderer.sendSync('pathBasename', path, suffix),
  pathDirname: (path: string) => electronAPI.ipcRenderer.sendSync('pathDirname', path),
  openPath: (path: string) => electronAPI.ipcRenderer.send('openPath', path),
  showSaveDialog: (options: Electron.SaveDialogOptions) =>
    electronAPI.ipcRenderer.invoke('showSaveDialog', options),
  showOpenDialog: (options: Electron.OpenDialogOptions) =>
    electronAPI.ipcRenderer.invoke('showOpenDialog', options)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
