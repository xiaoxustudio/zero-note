import { useEditor, EditorContent } from '@tiptap/react'
import { FileConfig } from '@renderer/types'
import { CSSProperties, useEffect, useState } from 'react'
import { readFile, changeDocConfig, changeDocContent } from '@renderer/utils/index'
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
      },
      onUpdate({ editor }) {
        const _c = editor.getHTML()
        if (select) changeDocContent(select.id, _c)
      }
    },
    [content]
  )
  useEffect(() => {
    changeDocConfig(select.id, { ...select, title })
    EventBus.emit('updateSider')
  }, [title]) //eslint-disable-line

  useEffect(() => {
    if (select)
      readFile(select.realFilePath).then((data) => {
        if (data.success) {
          setContent(data.content || '')
          setTitle(select.title || '')
        }
      })
    console.log(select)
  }, [select])
  if (!editor || !select) return null
  return (
    <div className={styles.container} style={style}>
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
