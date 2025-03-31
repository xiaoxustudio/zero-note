export interface FileConfig {
  title: string
  id: string
  createdTime: number
  lastUpdatedTime: number
  realFilePath: string
  file: boolean // realFilePath 是否存在
}
