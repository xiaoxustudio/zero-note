/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { normalize } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    frame: false,
    resizable: false,
    icon,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds()
    ipcMain.emit('windowResize', width, height)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

const getWindowFromEvent = (event: Electron.IpcMainInvokeEvent) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  return win
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('close', (event) => {
    const win = getWindowFromEvent(event)
    win?.close()
  })
  ipcMain.on('maximize', (event) => {
    const win = getWindowFromEvent(event)
    if (!win?.isMaximized()) win?.maximize()
    else win.unmaximize()
  })
  ipcMain.addListener('isMaximized', (event) => {
    const win = getWindowFromEvent(event)
    event.returnValue = win?.isMaximized()
  })
  ipcMain.on('minimize', (event) => {
    const win = getWindowFromEvent(event)
    win?.minimize()
  })
  ipcMain.addListener('getWindowPos', (event) => {
    const win = getWindowFromEvent(event)
    event.returnValue = win?.getPosition()
  })
  ipcMain.on('setWindowPos', (event, args) => {
    const win = getWindowFromEvent(event)

    const newX = Math.max(0, args.x) // 确保不小于0
    const newY = Math.max(0, args.y)
    win?.setPosition(newX, newY)
  })

  // 获取用户文档路径
  ipcMain.addListener('getDocPath', (e) => {
    e.returnValue = app.getPath('documents')
  })

  ipcMain.on('getTitle', (event) => {
    const win = getWindowFromEvent(event)
    event.returnValue = win?.getTitle()
  })

  // 显示打开对话框
  ipcMain.handle('showOpenDialog', (event, options) => {
    const win = getWindowFromEvent(event)
    return win && dialog.showOpenDialog(win, options)
  })

  // 显示保存对话框
  ipcMain.handle('showSaveDialog', (event, options) => {
    const win = getWindowFromEvent(event)
    if (!win) return
    return dialog.showSaveDialog(win, options)
  })

  // 检查文件/文件夹是否存在
  ipcMain.on('fileExists', async (event, filePath) => {
    try {
      fs.accessSync(filePath)
      event.returnValue = true
    } catch {
      event.returnValue = false
    }
  })

  // 创建文件
  ipcMain.handle('createFile', async (_, filePath, content = '') => {
    try {
      const dir = path.dirname(filePath)
      fs.mkdirSync(dir, { recursive: true }) // 自动创建父目录
      // 自动创建父目录
      fs.writeFileSync(filePath, content)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  // 创建文件夹
  ipcMain.handle('createDir', async (_, dirPath) => {
    try {
      fs.mkdirSync(dirPath, { recursive: true })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  // 读取文件
  ipcMain.handle('readFile', async (_, filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      return { success: true, content }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  // 读取目录
  ipcMain.handle('readDir', async (_, dirPath) => {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true })
      return {
        success: true,
        files: items
          .filter((dirent) => dirent.isFile())
          .map((dirent) => ({
            name: dirent.name,
            type: 'file',
            path: path.join(dirPath, dirent.name)
          })),
        directories: items
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => ({
            name: dirent.name,
            type: 'dir',
            path: path.join(dirPath, dirent.name)
          }))
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  // 删除文件/文件夹
  ipcMain.handle('deletePath', async (_, targetPath) => {
    try {
      const stats = fs.lstatSync(targetPath)

      if (stats.isDirectory()) {
        fs.rm(targetPath, { recursive: true, force: true }, () => {})
      } else {
        fs.unlinkSync(targetPath)
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })
  // 路径拼接
  ipcMain.addListener('pathPush', async (event, targetPath, distPath) => {
    event.returnValue = path.join(targetPath, distPath)
  })

  // 打开资源管理器路径
  ipcMain.on('openPath', (_, path) => {
    shell.openPath(normalize(path))
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
