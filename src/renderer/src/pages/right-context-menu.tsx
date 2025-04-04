import EventBus from '@renderer/bus'
import { FileConfig } from '@renderer/types'
import {
  CopyDocFile,
  createFile,
  deleteDocFile,
  readDocContent,
  showSaveDialog,
  toHtmlStr
} from '@renderer/utils'
import { FlexProps, PopoverProps } from 'antd'
import { useState } from 'react'
import PopoverMenu from '@renderer/components/popover/popover'
import { domToPng } from 'modern-screenshot'

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
          click() {
            const dom = document.querySelector('#editor-instance')! as HTMLElement
            domToPng(dom, {
              backgroundColor: 'white',
              height: dom.scrollHeight,
              style: {
                overflow: 'hidden'
              },
              quality: 1.0
            }).then((dataUrl) => {
              const link = document.createElement('a')
              link.download = 'screenshot.png'
              link.href = dataUrl
              link.click()
            })
            // globalJspdf.html(dom, {
            //   width: window.outerWidth,
            //   windowWidth: window.outerWidth,
            //   html2canvas: {
            //     scale: 0.25
            //   },
            //   x: 0,
            //   y: 0,
            //   callback: (doc) => {
            //     doc.save(`${item.title}.pdf`)
            //   }
            // })
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
