import { BaseConfig, DirectoryConfig, FileConfig } from '@renderer/types'
import { Tree } from 'antd'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { genFileList } from './utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import RightContextMenu from '../../pages/right-context-menu'
import styles from './index.module.less'

interface FileListProps {
  files: FileConfig[] | DirectoryConfig[]
  select: BaseConfig | undefined
  basePath: string
  onSelect: (info: BaseConfig) => void
}

function FileList({ files, select, onSelect }: FileListProps) {
  const titleRender = (node) => {
    return (
      <RightContextMenu
        item={node.config}
        arrow={false}
        placement="rightBottom"
        trigger="contextMenu"
        onClick={() => onSelect(node.config)}
      >
        <div className={classNames(styles.TitleRender, select?.id == node.id && 'is-selected')}>
          <div className={styles.TitleRenderTitle}>{node.title as ReactNode}</div>
        </div>
      </RightContextMenu>
    )
  }
  return (
    <Tree
      className={classNames(styles.FileList)}
      rootStyle={{ width: '100%' }}
      switcherIcon={({ expanded }) =>
        expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />
      }
      showIcon
      showLine
      treeData={genFileList(files)}
      titleRender={titleRender}
      selectable={false}
    />
  )
}
export default FileList
