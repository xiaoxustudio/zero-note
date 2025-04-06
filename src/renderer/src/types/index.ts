export interface BaseConfig {
  type: string
  id: string
  lastUpdatedTime: number
  realFilePath: string
  createdTime: number
  title: string
  file: boolean // realFilePath 是否存在
  children: BaseConfig[]
}

export interface FileConfig extends BaseConfig {
  type: 'file'
}

export interface DirectoryConfig extends BaseConfig {
  type: 'directory'
}

export interface SettingSubMenu {
  name: string // 子菜单key
  type: 'color' | 'text' | 'directory' | 'option' // 类型
  title: string // 显示标题
  value: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reset?: any // 可重置（值）
  option?: string[] // 选项值
}

export interface SettingMenu {
  name: string
  content: SettingSubMenu[]
}
