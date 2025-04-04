import Editor from './editor'
import Head from './head'
import {
  DocDir,
  EditorCodeBlockConfigToString,
  globalDirConfig,
  readDocDir,
  readSoftWareConfig,
  setGlobalConfig,
  setGlobalHeight,
  writeSoftWareConfig
} from '@renderer/utils'
import { FileConfig, SettingMenu } from '@renderer/types'
import { useState, useEffect, useMemo, useRef } from 'react'
import classNames from 'classnames'
import EventBus from '@renderer/bus'
import RightContextMenu from './right-context-menu'
import styles from './index.module.less'
import './index.less'
import { Settings } from 'lucide-react'
import Setting from './setting'
import classMenus from './setting/setting-config'

function AppContent() {
  const PageRef = useRef<HTMLDivElement>(null)
  const [openSetting, setSetting] = useState(false)
  const [height, setHeight] = useState(0)
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
    readSoftWareConfig().then((content) => {
      let config: SettingMenu[]
      if (!content) {
        // 没有配置文件
        window.api.createFile(globalDirConfig, '{}')
        writeSoftWareConfig(classMenus)
        config = classMenus
      } else {
        config = content
      }
      setGlobalConfig(config)
      EditorCodeBlockConfigToString(config[0].content)
    })
  }

  const handleResize = () => {
    setHeight(0) // 重置高度
    setTimeout(() => {
      if (!PageRef.current) return
      const { height } = PageRef.current.getBoundingClientRect()
      setHeight(height)
      setGlobalHeight(height)
    }, 0)
  }

  useEffect(() => {
    handleUpdateSider()
    EventBus.on('updateSider', handleUpdateSider)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
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
          <div className={styles.setting}>
            <Settings onClick={() => setSetting(true)} />
          </div>
        </div>
        <div className={styles.rightLayout}>
          {selectItem && <Editor select={selectItem} style={{ height: `${height}px` }} />}
          <div
            ref={PageRef}
            className={styles.noOpenDoc}
            style={{ opacity: !selectItem ? 1 : 0, visibility: selectItem && 'hidden' }}
          >
            请先打开一个文档
          </div>
        </div>
        {openSetting && <Setting open={openSetting} onclose={() => setSetting(false)} />}
      </div>
    </div>
  )
}
export default AppContent
