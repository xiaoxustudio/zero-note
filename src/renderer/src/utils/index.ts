import { FileConfig, SettingMenu, SettingSubMenu } from '@renderer/types'

export const userDir = './zereNote/'
export const userDocDir = './doc/'
export const globalDir = window.api.pathPush(window.api.getDocPath(), userDir)
export const DocDir = window.api.pathPush(globalDir, userDocDir)
export const DocDirConfig = pathPush(DocDir, './doc-config.json')
export const globalDirConfig = pathPush(globalDir, './config.json')

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
      // 查找相同颜色
      const currentColor = target.value ? `${target.value}` : '#000000'
      const find = Object.keys(colors).indexOf(currentColor)
      if (~find) {
        colors[currentColor].push(keywords)
      } else {
        colors[currentColor] = [keywords]
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

/* 文档 */
export function createDocFile(name: string, content: string) {
  const id = ID()
  const realFilePath = pathPush(DocDir, `${id}.znote`)
  window.api.createFile(realFilePath, content)
  window.api.createFile(
    pathPush(DocDir, `~${id}.znote.json`),
    JSON.stringify({
      title: name,
      id,
      createdTime: Date.now(),
      lastUpdatedTime: Date.now(),
      realFilePath
    })
  )
}

export function deleteDocFile(id: string) {
  window.api.deletePath(pathPush(DocDir, `${id}.znote`))
  window.api.deletePath(pathPush(DocDir, `~${id}.znote.json`))
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
  window.api.createFile(pathPush(DocDir, `~${id}.znote.json`), JSON.stringify(content))
}

export async function changeDocContent(id: string, content: string) {
  window.api.createFile(pathPush(DocDir, `${id}.znote`), content || '')
}

export function readDocDir() {
  return window.api.readDir(DocDir).then(({ success, files }) => {
    if (success) {
      const data = files
        .filter((v) => v.name.startsWith('~') && v.name.endsWith('.json'))
        .map(async (v) => {
          const config = JSON.parse((await readFile(v.path)).content || '')
          if (fileExists(config.realFilePath)) {
            return { ...config, file: true }
          } else {
            return { ...config, file: false }
          }
        })
      return Promise.all(data)
    } else {
      window.api.createFile(DocDirConfig, '{}')
      return []
    }
  })
}

/* 编辑器 */

// 读取软件配置
export async function readSoftWareConfig() {
  const t = await readFile(globalDirConfig)
  if (t.content) return JSON.parse(t.content)
  return {}
}

// 写入配置
export async function writeSoftWareConfig(content: SettingMenu[]) {
  createFile(globalDirConfig, JSON.stringify(content))
}
