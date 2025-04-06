import { ElectronAPI } from '@electron-toolkit/preload'

type ProcessMessage<T = { success: boolean; error?: string; content?: string }> = Promise<T>

interface IOItem {
  name: string
  type: string
  path: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      close: () => void
      minimize: () => void
      maximize: () => void
      isMaximized: () => boolean
      getWindowPos: () => [number, number]
      setWindowPos: (x: number, y: number) => void
      getTitle: () => string
      fileExists: (path: string) => boolean
      createFile: (path: string, content: string) => ProcessMessage
      readFile: (path: string) => ProcessMessage
      deletePath: (path: string) => ProcessMessage
      createDir: (path: string) => ProcessMessage
      readDir: (
        path: string
      ) => ProcessMessage<{ directories: IOItem[]; files: IOItem[]; success: boolean }>
      getDocPath: () => string
      pathPush: (path: string, path1: string) => string
      pathBasename: (path: string, suffix?: string) => string
      pathDirname: (path: string) => string
      openPath: (path: string) => void
      showSaveDialog: (
        options: Electron.SaveDialogOptions
      ) => Promise<Electron.SaveDialogReturnValue>
      showOpenDialog: (
        options: Electron.OpenDialogOptions
      ) => Promise<Electron.OpenDialogReturnValue>
    }
  }
}
