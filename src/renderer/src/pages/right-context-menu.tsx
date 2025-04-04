import EventBus from '@renderer/bus'
import { FileConfig } from '@renderer/types'
import {
  CopyDocFile,
  createFile,
  deleteDocFile,
  EditorCodeBlockConfigToString,
  GlobalConfig,
  readDocContent,
  showSaveDialog
} from '@renderer/utils'
import { FlexProps, PopoverProps } from 'antd'
import { useState } from 'react'
import PopoverMenu from '@renderer/components/popover/popover'

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
              const doc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css">
      <script src="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js"></script>
      <title>${item.title}</title>
      <style>
      pre{
       background: #2e2b29;
        border-radius: 0.5rem;
        color: white;
        font-family: JetBrainsMono, monospace;
        margin: 1.5rem 0;
        padding: 0.75rem 1rem;
        white-space: pre-wrap;
        position: relative;
        }
        pre:hover code[class^='language-']::after {
            opacity: 1;
        }
       code[class^='language-'] {
          background: none;
          color: inherit;
          font-size: 0.8rem;
          padding: 0;
        }
        code[class^='language-']::after {
          transition: opacity 0.15s linear;
          content: attr(data-lang);
          position: absolute;
          color: white;
          right: 0.5em;
          top: 0.5em;
          opacity: .3;
        }
      /* Code styling */
      ${EditorCodeBlockConfigToString(GlobalConfig[0].content)}
        </style>
    </head>
    <body>
    <h1>${item.title}</h1>
    ${content}
    <script>
      hljs.highlightAll();
    </script>
    </body>
    </html>`
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
