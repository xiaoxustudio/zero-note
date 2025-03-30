import { ElectronAPI } from '@electron-toolkit/preload'

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
    }
  }
}
