import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  close: () => electronAPI.ipcRenderer.send('close'),
  minimize: () => electronAPI.ipcRenderer.send('minimize'),
  maximize: () => electronAPI.ipcRenderer.send('maximize'),
  isMaximized: () => electronAPI.ipcRenderer.sendSync('isMaximized'),
  getWindowPos: () => electronAPI.ipcRenderer.sendSync('getWindowPos'),
  setWindowPos: (x: number, y: number) => electronAPI.ipcRenderer.send('setWindowPos', { x, y }),
  getTitle: () => electronAPI.ipcRenderer.sendSync('getTitle')
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
