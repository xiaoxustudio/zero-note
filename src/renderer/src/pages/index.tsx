import Editor from './editor'
import Head from './head'
import { DocDir, globalDirConfig, readDocDir } from '@renderer/utils'
import { FileConfig } from '@renderer/types'
import { useState, useEffect, useMemo, useRef } from 'react'
import classNames from 'classnames'
import EventBus from '@renderer/bus'
import RightContextMenu from './right-context-menu'
import styles from './index.module.less'
import './index.less'

function AppContent() {
  const PageRef = useRef<HTMLDivElement>(null)
  const [select, setSelect] = useState<string>()
  const [fileList, setFileList] = useState<FileConfig[]>([])
  const selectItem = useMemo(
    () => (select ? fileList.find((v) => v.id === select)! : undefined),
    [fileList, select]
  )
  const handleUpdateSider = () => {
    if (DocDir) {
      readDocDir().then((data) => setFileList(data))
    }
    window.api.createFile(globalDirConfig, '{}')
  }

  useEffect(() => {
    handleUpdateSider()
    EventBus.on('updateSider', handleUpdateSider)
  }, [])
  return (
    <div className={styles.container}>
      <Head />
      <div className={styles.Layout}>
        <div className={styles.leftLayout}>
          {fileList.map((v) => (
            <RightContextMenu
              key={v.id}
              className={styles.contextMenu}
              item={v}
              trigger="contextMenu"
              arrow={false}
              placement="rightBottom"
            >
              <div
                className={classNames(styles.ListItem, v.id === select && 'is-selected')}
                onClick={() => setSelect(v.id)}
              >
                {v.title}
              </div>
            </RightContextMenu>
          ))}
        </div>
        <div className={styles.rightLayout}>
          {selectItem && <Editor select={selectItem} />}
          <div
            ref={PageRef}
            className={styles.noOpenDoc}
            style={{ opacity: !selectItem ? 1 : 0, visibility: selectItem && 'hidden' }}
          >
            请先打开一个文档
          </div>
        </div>
      </div>
    </div>
  )
}
export default AppContent
