import { useEditor, EditorContent } from '@tiptap/react'
import { FileConfig } from '@renderer/types'
import { CSSProperties, useEffect, useState } from 'react'
import {
  changeDocConfig,
  changeDocContent,
  setGlobalEditor,
  readDocContent
} from '@renderer/utils/index'
import EventBus from '@renderer/bus'
import extensions from './extensions'
import BubbleMenuContent from './bubble-menu'
import styles from './index.module.less'
import './index.less'

export interface EditorProps {
  select: FileConfig
  style?: CSSProperties
}

function Editor({ select, style }: EditorProps) {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState(select.title)
  const editor = useEditor(
    {
      injectCSS: true,
      autofocus: true,
      extensions,
      content,
      onCreate({ editor }) {
        editor.view.dom.spellcheck = false
        setGlobalEditor(editor)
      },
      onUpdate({ editor }) {
        const _c = editor.getHTML()
        if (select) changeDocContent(select.id, _c)
      },
      onPaste(event) {
        event.preventDefault()
        const formats = window.api.readClipboardFormats()
        const html = window.api.readClipboardHTML()
        // 处理粘贴图片，将图片下载到本地并链接
        if (formats.some((v) => v.includes('image'))) {
          const match = html.match(/https?:\/\/(.[^"]*)/gi)
          if (match) {
            window.api.downloadImage(match[0]).then(({ success, content }) => {
              if (success && editor) {
                editor.chain().focus().setImage({ src: content! }).run()
              }
            })
          }
        }
      }
    },
    [content, select]
  )

  useEffect(() => {
    changeDocConfig(select.id, { ...select, title }).then(() => EventBus.emit('updateSider'))
  }, [title]) //eslint-disable-line

  useEffect(() => {
    if (select)
      readDocContent(select.id).then(async (data) => {
        setTitle(select.title || '')
        setContent(data || '')
      })
    const onPaste = (event) => {
      event.preventDefault()
    }
    window.addEventListener('paste', onPaste)
    return () => {
      window.removeEventListener('paste', onPaste)
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
      <EditorContent className={styles.Editor} editor={editor}>
        <BubbleMenuContent className={styles.BubbleMenu} editor={editor} />
      </EditorContent>
    </div>
  )
}

export default Editor
