import RightContextMenu from '@renderer/pages/right-context-menu'
import { SelectConfig } from '@renderer/types'
import classNames from 'classnames'
import { useState, ReactNode } from 'react'
import styles from './title-render.module.less'
import { DataNode } from 'antd/es/tree'
import { HookAPI } from 'antd/es/modal/useModal'
import { renameFileOrDirectory } from '@renderer/utils'
import EventBus from '@renderer/bus'

interface TitleRenderProps {
  select: SelectConfig | undefined
  node: DataNode
  modal: HookAPI
  onSelect: () => void
}

function TitleRender({
  select,
  node,
  modal,
  onSelect
}: TitleRenderProps & { node: { config?: SelectConfig; id?: string } }) {
  const [open, setOpen] = useState(false)
  const [rename, setRename] = useState(false)
  const [title, setTitle] = useState(node.title as string)
  const onBulr = () => {
    setRename(false)
    if (title !== node.title)
      modal.confirm({
        icon: null,
        title: '重命名',
        content: (
          <>
            是否执行重命名：{node.title} <b>to</b> {title}
          </>
        ),
        okText: '修改',
        cancelText: '取消',
        onOk() {
          const config = node.config
          if (!config) return
          renameFileOrDirectory(config.id, title).then(() => EventBus.emit('updateSider'))
        },
        centered: true,
        closable: false,
        okButtonProps: {
          type: 'text'
        },
        cancelButtonProps: {
          type: 'text'
        },
        maskProps: {
          onContextMenu(e: MouseEvent) {
            e.stopPropagation()
          }
        }
      })
  }
  return (
    <RightContextMenu
      open={open}
      onOpenChange={(n) => setOpen(n)}
      item={node.config as SelectConfig}
      arrow={false}
      placement="rightBottom"
      onClick={onSelect}
      onRename={() => setRename(true)}
    >
      <div className={classNames(styles.TitleRender, select?.id == node.id && 'is-selected')}>
        {!rename && <div className={styles.TitleRenderTitle}>{node.title as ReactNode}</div>}
        {rename && (
          <input
            className={styles.TitleRenderTitle}
            type="text"
            autoFocus
            value={title}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={onBulr}
          />
        )}
      </div>
    </RightContextMenu>
  )
}
export default TitleRender
