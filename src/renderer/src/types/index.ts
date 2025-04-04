export interface FileConfig {
  title: string
  id: string
  createdTime: number
  lastUpdatedTime: number
  realFilePath: string
  file: boolean // realFilePath 是否存在
}

export interface SettingSubMenu {
  name: string // 子菜单key
  type: 'color' | 'text' | 'directory' // 类型
  title: string // 显示标题
  value: string
}

export interface SettingMenu {
  name: string
  content: SettingSubMenu[]
}
