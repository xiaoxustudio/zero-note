import EventBus from '@renderer/bus'
import { FileConfig } from '@renderer/types'
import {
  CopyDocFile,
  createFile,
  deleteDocFile,
  readDocContent,
  readEditorConfig,
  showSaveDialog,
  toHtmlStr
} from '@renderer/utils'
import { FlexProps, PopoverProps } from 'antd'
import { useState } from 'react'
import PopoverMenu from '@renderer/components/popover/popover'
import { domToJpeg, domToPng, domToSvg, domToWebp } from 'modern-screenshot'
import { docImageExportSuffix } from './setting/setting-config'

interface RightContextMenuProps extends Partial<PopoverProps & FlexProps> {
  item: FileConfig
}

function RightContextMenu({ item, className, children, ...props }: RightContextMenuProps) {
  const [open, setOpen] = useState(false)
  const menus = [
    {
      name: '复制',
      click() {
        CopyDocFile(item.id, { title: item.title + '- 副本' }).then(() => {
          EventBus.emit('updateSider')
        })
      }
    },
    {
      name: '删除',
      click() {
        deleteDocFile(item.id)
        EventBus.emit('updateSider')
      }
    },
    {
      name: '导出为',
      children: [
        {
          name: 'HTML',
          click() {
            readDocContent(item.id).then((content) => {
              const doc = toHtmlStr(item, content!)
              showSaveDialog({
                title: item.title,
                defaultPath: `${window.api.getDocPath()}/${item.title}.html`,
                filters: [
                  { name: 'html', extensions: ['html'] },
                  { name: '*', extensions: ['*'] }
                ]
              }).then((r) => {
                createFile(r.filePath, doc)
              })
            })
          }
        },
        {
          name: 'image',
          async click() {
            const dom = document.querySelector('#editor-instance')! as HTMLElement
            const suffix = (await readEditorConfig('save-doc-image-suffix'))?.value || 'png'
            const config = {
              backgroundColor: 'white',
              height: dom.scrollHeight,
              style: {
                overflow: 'hidden'
              },
              quality: 1.0
            }
            let dataUrl = ''
            switch (suffix as (typeof docImageExportSuffix)[number]) {
              case 'png':
                dataUrl = await domToPng(dom, config)
                break
              case 'jpeg':
                dataUrl = await domToJpeg(dom, config)
                break
              case 'svg':
                dataUrl = await domToSvg(dom, config)
                break
              case 'webp':
                dataUrl = await domToWebp(dom, config)
                break
            }
            const link = document.createElement('a')
            link.download = `${item.title}.${suffix}`
            link.href = dataUrl
            link.click()
          }
        }
      ]
    },
    {
      name: '在资源管理器中打开',
      click() {
        window.api.openPath(item.realFilePath.substring(0, item.realFilePath.lastIndexOf('\\')))
      }
    }
  ]
  return (
    <PopoverMenu
      open={open}
      menu={menus}
      className={className}
      onOpenChange={(n) => setOpen(n)}
      {...props}
    >
      {children}
    </PopoverMenu>
  )
}
export default RightContextMenu
