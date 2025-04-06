import { FileConfig, DirectoryConfig } from '@renderer/types'
import { DataNode } from 'antd/es/tree'
import { Folder, File } from 'lucide-react'

export function genFileList(files: FileConfig[] | DirectoryConfig[]): DataNode[] {
  return files.map((v) => ({
    ...v,
    key: v.id,
    icon: v.type === 'file' ? <File size={16} /> : <Folder size={16} />,
    children: v.children && v.children.length ? genFileList(v.children) : [],
    config: v
  }))
}
