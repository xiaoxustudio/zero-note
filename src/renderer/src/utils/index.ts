import { BaseConfig, FileConfig, SettingMenu, SettingSubMenu } from '@renderer/types'
import { Editor } from '@tiptap/react'
export * from './html'

/* 默认配置 */
export const userDir = './zereNote/'
export const userDocDir = './doc/'
export const globalDir = window.api.pathPush(window.api.getDocPath(), userDir)
export let DocDir = window.api.pathPush(globalDir, userDocDir)
export let DocDirConfig = pathPush(DocDir, './doc-config.json')
export let globalDirConfig = pathPush(globalDir, './config.json')

export let GlobalConfig = {} as SettingMenu[]
export let GlobalEditor: Editor

export const setGlobalEditor = (e: Editor) => {
  GlobalEditor = e
}

export const setGlobalConfig = async (content: SettingMenu[]) => {
  GlobalConfig = content
  const _g = (await readEditorConfig('save-path'))?.value
  if (_g) {
    DocDir = _g
    DocDirConfig = pathPush(DocDir, './doc-config.json')
    globalDirConfig = pathPush(globalDir, './config.json')
  }
}

export let GlobalHeight = 0

export const setGlobalHeight = (width: number) => {
  GlobalHeight = width
}

export function UUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function ID(
  length: number = 6,
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function findFileOrDirectoryForID(files: BaseConfig[], id?: string): BaseConfig | null {
  if (!id) return null
  for (const i of files) {
    const findChildren = findFileOrDirectoryForID(i.children || [], id)
    if (i.id === id || findChildren) return i || findChildren
  }
  return null
}

/* 生成相关 */

// 根据颜色配置生成相关颜色
export function EditorCodeBlockConfigToString(obj: SettingSubMenu[]) {
  document.querySelector('#codeBlockStyle')?.remove()
  const styledom = document.createElement('style')
  const colors: Record<string, string[]> = {}
  for (const index in obj) {
    const keywords = obj[index].name
    const target = obj[index]
    if (keywords !== '--' && target) {
      switch (target.type) {
        case 'color': {
          // 查找相同颜色
          const currentColor = target.value ? `${target.value}` : '#000000'
          const find = Object.keys(colors).indexOf(currentColor)
          if (~find) {
            colors[currentColor].push(keywords)
          } else {
            colors[currentColor] = [keywords]
          }
          break
        }
      }
    }
  }
  let str = ''
  for (const color in colors) {
    const keywords = colors[color]
    let sub = ''
    for (const k of keywords) {
      sub += `.${k},`
    }
    sub = sub.slice(0, sub.length - 1)
    sub += `{
    color : ${color};
    }\n`
    str += sub
  }
  styledom.textContent = str
  styledom.id = 'codeBlockStyle'
  document.head.append(styledom)
  return str
}

/* IO 相关 */

export function showSaveDialog(option: Electron.SaveDialogOptions) {
  return window.api.showSaveDialog(option)
}

export function fileExists(path: string) {
  return window.api.fileExists(path)
}

export function pathPush(path: string, path1: string) {
  return window.api.pathPush(path, path1)
}

export function readFile(path: string) {
  return window.api.readFile(path)
}

export function readDir(path: string) {
  return window.api.readDir(path)
}

export function createFile(path: string, content: string) {
  return window.api.createFile(path, content)
}

export function createDir(path: string) {
  return window.api.createDir(path)
}

/* 文档 */

export function createDocDir(title: string, baseDir = DocDir) {
  const id = ID()
  const dirPath = `${baseDir}\\${title}`
  const realFilePath = pathPush(dirPath, `config.json`)
  const config = {
    title,
    id,
    createdTime: Date.now(),
    lastUpdatedTime: Date.now(),
    realFilePath
  }
  window.api.createFile(realFilePath, JSON.stringify(config))
  return config
}

export function createDocFile(title: string, content: string, baseDir = DocDir) {
  const id = ID()
  const realFilePath = pathPush(baseDir, `${id}.znote`)
  const config = {
    title,
    id,
    createdTime: Date.now(),
    lastUpdatedTime: Date.now(),
    realFilePath
  }
  window.api.createFile(realFilePath, content)
  window.api.createFile(pathPush(baseDir, `~${id}.znote.json`), JSON.stringify(config))
  return config
}

export function deleteDocFile(id: string, baseDir = DocDir) {
  const dirName = window.api.pathDirname(baseDir)
  const rpath = pathPush(dirName, `${id}.znote`)
  const rfpath = pathPush(dirName, `~${id}.znote.json`)
  if (fileExists(rfpath)) {
    window.api.deletePath(rpath)
    window.api.deletePath(rfpath)
  } else {
    // 删除文件夹
    window.api.deletePath(dirName)
  }
}

export async function CopyDocFile(id: string, config?: Partial<FileConfig & { content: string }>) {
  const content = (await readFile(pathPush(DocDir, `${id}.znote`))).content
  const ofileConfig = await readDocConfig(id)
  const newId = ID() // 新ID
  const newfile = pathPush(DocDir, `${newId}.znote`)
  const newfileConfigPath = pathPush(DocDir, `~${newId}.znote.json`)
  const newconfig = {
    ...ofileConfig,
    ...config
  }
  window.api.createFile(newfile, content || '')
  window.api.createFile(
    newfileConfigPath,
    JSON.stringify({
      ...newconfig,
      id: newId,
      createdTime: Date.now(),
      lastUpdatedTime: Date.now(),
      realFilePath: newfile
    })
  )
}

export async function readDocConfig(id: string): Promise<FileConfig> {
  const path = pathPush(DocDir, `~${id}.znote.json`)
  return JSON.parse((await readFile(path)).content || '')
}

export async function readDocContent(id: string) {
  const path = pathPush(DocDir, `${id}.znote`)
  return (await readFile(path)).content
}

export async function changeDocConfig(id: string, content: Record<string, unknown>) {
  const fileList = await readDocDir()
  const find = findFileOrDirectoryForID(fileList, id)
  if (find) {
    const baseName = window.api.pathDirname(find.realFilePath)
    window.api.createFile(`${baseName}\\~${id}.znote.json`, JSON.stringify(content))
  }
}

export async function changeDocContent(id: string, content: string) {
  const fileList = await readDocDir()
  const find = findFileOrDirectoryForID(fileList, id)
  if (find) window.api.createFile(find.realFilePath, content || '')
}

export function readDocDir(basePath = DocDir) {
  return window.api.readDir(basePath).then(({ success, files, directories }) => {
    if (success) {
      const data = files
        .filter((v) => (v.name.startsWith('~') && v.name.endsWith('.json')) || v.type === 'dir')
        .map(async (v) => {
          const config = JSON.parse((await readFile(v.path)).content || '')
          config.type = 'file'
          if (fileExists(config.realFilePath)) {
            return { ...config, file: true }
          } else {
            return { ...config, file: false }
          }
        })
      const dirDatas = directories.map(async (v) => {
        const config = JSON.parse((await readFile(`${v.path}\\config.json`)).content || '')
        config.type = 'directory'
        config.children = await readDocDir(v.path)
        if (fileExists(config.realFilePath)) {
          return { ...config, file: true }
        } else {
          return { ...config, file: false }
        }
      })
      return Promise.all([...data, ...dirDatas])
    } else {
      window.api.createFile(DocDirConfig, '{}')
      return []
    }
  })
}

/* 编辑器 */

// 读取软件配置
export async function readSoftWareConfig(): Promise<SettingMenu[] | null> {
  const t = await readFile(globalDirConfig)
  if (t.content) return JSON.parse(t.content) as SettingMenu[]
  return null
}
// 读取编辑器配置
export async function readEditorConfig(name: string) {
  const data = await readSoftWareConfig()
  if (data) {
    const newData = data as SettingMenu[]
    const find = newData.find((v) => v.name === '编辑器配置')
    if (find) {
      const find1 = find.content.find((v) => v.name === name)
      return find1 ? find1 : null
    }
  }
  return null
}

// 写入配置
export async function writeSoftWareConfig(content: SettingMenu[]) {
  createFile(globalDirConfig, JSON.stringify(content))
}
