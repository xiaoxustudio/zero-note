import { useEditor, EditorContent } from '@tiptap/react'
import styles from './index.module.less'
import BubbleMenuContent from './bubble-menu'
import { FileConfig } from '@renderer/types'
import { CSSProperties, useEffect, useState } from 'react'
import { readFile, createFile } from '@renderer/utils/index'
import extensions from './extensions'
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
        if (select) createFile(select.realFilePath, _c)
      }
    },
    [content]
  )
  useEffect(() => {
    if (select)
      readFile(select.realFilePath).then((data) => {
        if (data.success) setContent(data.content || '')
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
