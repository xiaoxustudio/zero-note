import EventBus from '@renderer/bus'
import { FileConfig } from '@renderer/types'
import {
  CopyDocFile,
  createFile,
  deleteDocFile,
  readDocContent,
  showSaveDialog
} from '@renderer/utils'
import { Button, Flex, FlexProps, Popover, PopoverProps } from 'antd'
import { useState } from 'react'

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
      name: '导出HTML',
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
    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #fbbc88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #b9f18d;
    }

    .hljs-title,
    .hljs-section {
      color: #faf594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70cff8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }</style>
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
    },
    {
      name: '在资源管理器中打开',
      click() {
        window.api.openPath(item.realFilePath.substring(0, item.realFilePath.lastIndexOf('\\')))
      }
    }
  ]
  return (
    <Popover
      {...props}
      open={open}
      onOpenChange={(n) => setOpen(n)}
      content={
        <Flex vertical justify="left" align="start" className={className}>
          {menus.map((v) => (
            <Button
              key={v.name}
              type="text"
              onClick={() => {
                v.click?.()
                setOpen(false)
              }}
            >
              {v.name}
            </Button>
          ))}
        </Flex>
      }
    >
      {children}
    </Popover>
  )
}
export default RightContextMenu
