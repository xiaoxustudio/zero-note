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
import { useState, useEffect, useRef, useCallback } from 'react'
import EventBus from '@renderer/bus'
import { Settings } from 'lucide-react'
import Setting from '../components/setting'
import classMenus from '../components/setting/setting-config'
import FileList from '../components/file-list'
import styles from './index.module.less'
import './index.less'
import TooltipWrap from '@renderer/components/tooltip'

function AppContent() {
  const PageRef = useRef<HTMLDivElement>(null)
  const [openSetting, setSetting] = useState(false)
  const [height, setHeight] = useState(0)
  const [select, setSelect] = useState<FileConfig>()
  const [fileList, setFileList] = useState<FileConfig[]>([])

  const handleUpdateSider = useCallback(() => {
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
        if (DocDir)
          readDocDir().then((data) => {
            setFileList(data)
            // 判断 当前打开的 是否还存在，不存在关闭编辑器
            if (select && !data.some((v) => v.id == select.id)) {
              setSelect(undefined)
            }
          })
      })
    })
  }, [select])

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
    EventBus.on('updateSider', handleUpdateSider)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      EventBus.off('updateSider', handleUpdateSider)
    }
  }, [handleUpdateSider])

  useEffect(() => {
    handleUpdateSider()
    handleResize()
  }, []) //eslint-disable-line

  return (
    <div className={styles.container}>
      <Head />
      <div className={styles.Layout}>
        <div className={styles.leftLayout}>
          <FileList files={fileList} basePath="/" onSelect={onSelect} select={select} />
          <div className={styles.setting}>
            <TooltipWrap title="设置" placement="top">
              <Settings onClick={() => setSetting(true)} />
            </TooltipWrap>
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
