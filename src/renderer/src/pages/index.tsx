import Editor from '../components/editor'
import Head from '../components/head'
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
import { useState, useEffect, useRef } from 'react'
import EventBus from '@renderer/bus'
import { Settings } from 'lucide-react'
import Setting from '../components/setting'
import classMenus from '../components/setting/setting-config'
import FileList from '../components/file-list'
import styles from './index.module.less'
import './index.less'

function AppContent() {
  const PageRef = useRef<HTMLDivElement>(null)
  const [openSetting, setSetting] = useState(false)
  const [height, setHeight] = useState(0)
  const [select, setSelect] = useState<FileConfig>()
  const [fileList, setFileList] = useState<FileConfig[]>([])
  const handleUpdateSider = () => {
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
      EditorCodeBlockConfigToString(config[0].content)
      setGlobalConfig(config).then(() => {
        if (DocDir) readDocDir().then((data) => setFileList(data))
      })
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

  const onSelect = (node) => {
    if (node.type === 'file') setSelect(node)
    else setSelect(undefined)
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
          <FileList files={fileList} basePath="/" onSelect={onSelect} select={select} />
          <div className={styles.setting}>
            <Settings onClick={() => setSetting(true)} />
          </div>
        </div>
        <div className={styles.rightLayout}>
          {select && <Editor select={select} style={{ height: `${height}px` }} />}
          <div
            ref={PageRef}
            className={styles.noOpenDoc}
            style={{ opacity: !select ? 1 : 0, visibility: select && 'hidden' }}
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
