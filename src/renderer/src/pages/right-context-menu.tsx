import EventBus from '@renderer/bus'
import { BaseConfig, FileConfig } from '@renderer/types'
import {
  CopyDocFile,
  createDocDir,
  createDocFile,
  createFile,
  deleteDocFile,
  GlobalEditor,
  HtmltoImage,
  readDocContent,
  readEditorConfig,
  showSaveDialog,
  toHtmlStr
} from '@renderer/utils'
import { FlexProps, PopoverProps } from 'antd'
import PopoverMenu from '@renderer/components/popover/popover'
import jsPDF from 'jspdf'
import { domToCanvas } from 'modern-screenshot'

interface RightContextMenuProps extends Partial<PopoverProps & FlexProps> {
  item: BaseConfig | undefined
  onRename: () => void
}

function RightContextMenu({
  item,
  className,
  children,
  onRename,
  ...props
}: RightContextMenuProps) {
  if (!item) return children
  const basePath = item.realFilePath
  const isFile = item.type === 'file'
  const menus = [
    {
      name: '新建文件',
      click() {
        const dir = window.api.pathDirname(basePath)
        createDocFile('无标题', '', dir)
        EventBus.emit('updateSider')
      }
    },
    {
      name: '新建文件夹',
      click() {
        const dir = window.api.pathDirname(basePath)
        const title = '无标题'
        createDocDir(title, dir)
        EventBus.emit('updateSider')
      }
    },
    {
      name: '复制',
      disabled: !isFile,
      click() {
        CopyDocFile(item.id, { title: item.title + '- 副本' }).then(() => {
          EventBus.emit('updateSider')
        })
      }
    },
    {
      name: '删除',
      click() {
        deleteDocFile(item.id, item.realFilePath)
        EventBus.emit('updateSider')
      }
    },
    {
      name: '重命名',
      click() {
        onRename()
      }
    },
    {
      name: '导出为',
      persist: true,
      disabled: !document.querySelector('#editor-instance') || !isFile,
      children: [
        {
          name: 'HTML',
          click() {
            if (item.type !== 'file') return
            readDocContent(item.id).then((content) => {
              const doc = toHtmlStr(item as FileConfig, content!)
              showSaveDialog({
                title: item.title,
                defaultPath: `${window.api.getDocPath()}/${item.title}.html`,
                filters: [{ name: 'html', extensions: ['html'] }]
              }).then((r) => {
                createFile(r.filePath, doc)
              })
            })
          }
        },
        {
          name: 'Image',
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
            const dataUrl = await HtmltoImage(dom, config, suffix)
            const link = document.createElement('a')
            link.download = `${item.title}.${suffix}`
            link.href = dataUrl
            link.title = '测试'
            link.click()
          }
        },
        {
          name: 'Markdown',
          click() {
            const md = `# ${item.title}\n${GlobalEditor.storage.markdown.getMarkdown()}`
            showSaveDialog({
              title: item.title,
              defaultPath: `${window.api.getDocPath()}/${item.title}.md`,
              filters: [{ name: 'markdown', extensions: ['md'] }]
            }).then((r) => {
              createFile(r.filePath, md)
            })
          }
        },
        {
          name: 'Pdf',
          async click() {
            const pdf = new jsPDF('p', 'mm', 'a4')
            const dom = document.querySelector('#editor-instance')! as HTMLElement
            const canvas = await domToCanvas(dom, {
              backgroundColor: 'white',
              height: dom.scrollHeight,
              style: {
                overflow: 'hidden'
              },
              quality: 1.0,
              width: dom.clientWidth,
              scale: 4
            })
            const ctx = canvas.getContext('2d')!
            ctx.imageSmoothingEnabled = false
            const a4w = 190
            const a4h = 277 // A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
            const imgHeight = Math.floor((a4h * canvas.width) / a4w) // 按A4显示比例换算一页图像的像素高度
            let renderedHeight = 0
            while (renderedHeight < canvas.height) {
              const page = document.createElement('canvas')
              page.width = canvas.width
              page.height = Math.min(imgHeight, canvas.height - renderedHeight) // 可能内容不足一页
              // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
              if (page && ctx) {
                page
                  .getContext('2d')!
                  .putImageData(
                    ctx.getImageData(
                      0,
                      renderedHeight,
                      canvas.width,
                      Math.min(imgHeight, canvas.height - renderedHeight)
                    ),
                    0,
                    0
                  )
              }
              pdf.addImage(
                page.toDataURL('image/jpeg', 1.0),
                'JPEG',
                10,
                10,
                a4w,
                Math.min(a4h, (a4w * page.height) / page.width)
              ) // 添加图像到页面，保留10mm边距
              renderedHeight += imgHeight
              if (renderedHeight < canvas.height) {
                pdf.addPage() // 如果后面还有内容，添加一个空页
              }
            }
            pdf.save(`${item.title}.pdf`)
          }
        }
      ]
    },
    {
      name: '在资源管理器中打开',
      click() {
        window.api.openPath(basePath.substring(0, basePath.lastIndexOf('\\')))
      }
    }
  ]

  return (
    <PopoverMenu menu={menus} className={className} {...props} trigger={'contextMenu'}>
      {children}
    </PopoverMenu>
  )
}
export default RightContextMenu
