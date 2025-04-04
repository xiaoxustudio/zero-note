import styles from './index.module.less'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { SettingMenu, SettingSubMenu } from '@renderer/types'
import classNames from 'classnames'
import classMenus from './setting-config'
import {
  EditorCodeBlockConfigToString,
  GlobalHeight,
  readSoftWareConfig,
  writeSoftWareConfig
} from '@renderer/utils'
import { Folder } from 'lucide-react'

interface SettingProps {
  open: boolean
  onclose: () => void
}

// 软件生命周期存储
let config: SettingMenu[]

function Setting({ open, onclose }: SettingProps) {
  const [select, setSelect] = useState<SettingMenu | null>(null)

  const initConfig = () => {
    readSoftWareConfig().then((content) => {
      if (!content) {
        config = classMenus
      } else {
        config = content
      }
      setSelect(config[0])
    })
  }

  useEffect(() => {
    initConfig()
  }, [])

  return (
    <>
      {open ? (
        <div className={styles.settingBoxWrapper} style={{ height: `${GlobalHeight}px` }}>
          <div className={styles.settingBoxContent}>
            <div className={styles.settingBoxInnerContent}>
              <div className={styles.settingLeft}>
                {classMenus.map((v, index) => (
                  <Button
                    key={v.name}
                    type="text"
                    className={classNames(
                      select && select.name === v.name && styles.settingItemSelected
                    )}
                    onClick={() => {
                      config[index] = v
                      setSelect(v)
                    }}
                  >
                    {v.name}
                  </Button>
                ))}
                <div className={styles.settingApply}>
                  <Button
                    className="button-primary"
                    type="text"
                    onClick={() => {
                      if (select && select.content) EditorCodeBlockConfigToString(select.content)
                      if (config) writeSoftWareConfig(config)
                      onclose()
                    }}
                  >
                    应用
                  </Button>
                  <Button
                    type="text"
                    onClick={() => {
                      onclose()
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
              <div className={styles.settingRight}>
                {select && select.content.length
                  ? select.content.map((v, index) => (
                      <div
                        key={v.name + v.title}
                        className={classNames(
                          styles.settingItem,
                          v.name === '--' && styles.settingDivider
                        )}
                      >
                        {v.name === '--' ? <h3>{v.title}</h3> : <span>{v.title}</span>}
                        {v.name !== '--' && v.type === 'color' && (
                          <input
                            type="color"
                            value={(v.value ?? '#000000') as string}
                            onChange={(e) =>
                              setSelect((item) => {
                                if (!item) return null
                                let contents: SettingSubMenu[] = []
                                if (item && item.content.length) {
                                  contents = item.content
                                  contents[index] = {
                                    ...item.content[index],
                                    value: e.target.value
                                  }
                                }
                                return {
                                  ...item,
                                  content: contents
                                }
                              })
                            }
                          />
                        )}
                        {v.name !== '--' && v.type === 'directory' && (
                          <div className={styles.settingDirectory}>
                            <input value={(v.value ?? '') as string} readOnly />
                            <Folder
                              onClick={() => {
                                window.api
                                  .showOpenDialog({ properties: ['openDirectory'] })
                                  .then(({ canceled, filePaths }) => {
                                    if (!canceled)
                                      setSelect((item) => {
                                        if (!item) return null
                                        let contents: SettingSubMenu[] = []
                                        if (item && item.content.length) {
                                          contents = item.content
                                          contents[index] = {
                                            ...item.content[index],
                                            value: filePaths[0]
                                          }
                                        }
                                        return {
                                          ...item,
                                          content: contents
                                        }
                                      })
                                  })
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Setting
