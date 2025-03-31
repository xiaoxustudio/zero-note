import Editor from './editor'
import Head from './head'
import { DocDir, globalDirConfig, readDocDir } from '@renderer/utils'
import { FileConfig } from '@renderer/types'
import { useState, useEffect, useMemo, useRef } from 'react'
import styles from './index.module.less'
import './index.less'
import classNames from 'classnames'
import EventBus from '@renderer/bus'
import { Popover } from 'antd'
import RightContextMenu from './right-context-menu'

function AppContent() {
  const PageRef = useRef<HTMLDivElement>(null)
  const bound = useRef<DOMRect>(new DOMRect())
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
    if (PageRef.current) {
      bound.current = PageRef.current.getBoundingClientRect()
    }
  }, [])
  return (
    <div className={styles.container}>
      <Head />
      <div className={styles.Layout}>
        <div className={styles.leftLayout}>
          {fileList.map((v) => (
            <Popover
              key={v.id}
              content={<RightContextMenu className={styles.contextMenu} item={v} />}
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
            </Popover>
          ))}
        </div>
        <div className={styles.rightLayout}>
          {selectItem ? (
            <Editor
              select={selectItem}
              style={{ height: `${Math.ceil(bound.current.height)}px` }}
            />
          ) : (
            <div ref={PageRef} className={styles.noOpenDoc}>
              请先打开一个文档
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default AppContent
