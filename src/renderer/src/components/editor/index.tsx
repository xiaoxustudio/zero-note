import { useEditor, EditorContent, posToDOMRect } from '@tiptap/react'
import { FileConfig } from '@renderer/types'
import { CSSProperties, useEffect, useState } from 'react'
import {
  changeDocConfig,
  changeDocContent,
  setGlobalEditor,
  readDocContent
} from '@renderer/utils/index'
import EventBus from '@renderer/bus'
import { Fragment } from '@tiptap/pm/model'
import extensions from './extensions'
import BubbleMenuContent from './bubble-menu'
import EditorRightContextMenu from './context-menu'
import styles from './index.module.less'
import './index.less'

export interface EditorProps {
  select: FileConfig
  style?: CSSProperties
}

function Editor({ select, style }: EditorProps) {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState(select.title)
  const [selectionRect, setSelectionRect] = useState<DOMRect>()
  const editor = useEditor(
    {
      injectCSS: true,
      autofocus: true,
      extensions,
      content,
      onCreate({ editor }) {
        editor.view.dom.spellcheck = false
        editor.view.dom.addEventListener('paste', (e) => e.preventDefault())
        setGlobalEditor(editor)
      },
      onUpdate({ editor }) {
        const _c = editor.getHTML()
        if (select) changeDocContent(select.id, _c)
      },
      onPaste(event, slice) {
        event.preventDefault()
        const formats = window.api.readClipboardFormats()
        const html = window.api.readClipboardHTML()
        // 处理粘贴图片，将图片下载到本地并链接
        if (formats.some((v) => v.includes('image'))) {
          const match = html.match(/https?:\/\/(.[^"]*)/gi)
          if (match && editor) {
            window.api.downloadImage(match[0]).then(({ success, content }) => {
              const { state, view } = editor
              const { from, to } = state.selection
              if (success) {
                const image = state.schema.nodes.image.create({
                  src: content!,
                  alt: slice.content.content[0].attrs.alt || ''
                })
                const fragment = Fragment.from(image)
                const tr = state.tr.replaceWith(from, to, fragment)
                view.dispatch(tr)
              }
            })
          }
        }
      }
    },
    [content, select]
  )
  const [popoverVisible, setPopoverVisible] = useState(false)
  // 处理右键点击事件
  const handleContextMenu = (event) => {
    event.preventDefault()
    if (editor) {
      const { state } = editor
      const { from, to } = state.selection
      const currentRect = posToDOMRect(editor.view, from, to)
      setSelectionRect(currentRect)
    }
    setPopoverVisible(true)
  }

  useEffect(() => {
    changeDocConfig(select.id, { ...select, title }).then(() => EventBus.emit('updateSider'))
  }, [title]) //eslint-disable-line

  useEffect(() => {
    if (select) {
      readDocContent(select.id).then(async (data) => {
        setTitle(select.title || '')
        setContent(data || '')
      })
    }
  }, [select])

  if (!editor || !select) return null

  return (
    <div id="editor-instance" className={styles.container} style={style}>
      <input
        className={styles.TitleInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            editor.commands.focus()
          }
        }}
      />
      <EditorContent onContextMenu={handleContextMenu} className={styles.Editor} editor={editor}>
        <BubbleMenuContent className={styles.BubbleMenu} editor={editor} />
      </EditorContent>
      <EditorRightContextMenu
        open={popoverVisible}
        editor={editor}
        rect={selectionRect}
        onClose={() => setPopoverVisible(false)}
      />
    </div>
  )
}

export default Editor
