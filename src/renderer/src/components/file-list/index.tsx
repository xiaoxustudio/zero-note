import { BaseConfig, DirectoryConfig, FileConfig, SelectConfig } from '@renderer/types'
import { Tree } from 'antd'
import classNames from 'classnames'
import { genFileList } from './utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import TitleRender from './title-render'
import { DataNode } from 'antd/es/tree'
import useModal from 'antd/es/modal/useModal'
import styles from './index.module.less'

interface FileListProps {
  files: FileConfig[] | DirectoryConfig[]
  select: BaseConfig | undefined
  basePath: string
  onSelect: (info: BaseConfig) => void
}

function FileList({ files, select, onSelect }: FileListProps) {
  const [modal, ModalInstance] = useModal()

  return (
    <>
      <Tree
        className={classNames(styles.FileList)}
        rootStyle={{ width: '100%' }}
        switcherIcon={({ expanded }) =>
          expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        }
        showIcon
        showLine
        treeData={genFileList(files)}
        titleRender={(node: DataNode & { config?: SelectConfig }) => (
          <TitleRender
            node={node}
            select={select}
            modal={modal}
            onSelect={() => onSelect(node.config!)}
          />
        )}
        selectable={false}
      />
      {ModalInstance}
    </>
  )
}
export default FileList
