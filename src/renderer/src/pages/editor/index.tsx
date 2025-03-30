import { FloatingMenu, useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Plus } from 'lucide-react'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import styles from './index.module.less'
import BubbleMenuContent from './bubble-menu'
import './index.less'

const extensions = [
  StarterKit.configure({
    bold: {
      HTMLAttributes: {
        class: 'bold'
      }
    }
  }),
  Highlight.configure({ multicolor: true }),
  TextStyle,
  Color.configure({ types: ['textStyle'] })
]

function Editor() {
  const editor = useEditor({
    injectCSS: true,
    autofocus: true,
    extensions
  })
  return (
    <div className={styles.container}>
      <div className={styles.leftLayout}></div>
      <div className={styles.rightLayout}>
        {editor && (
          <EditorContent editor={editor}>
            <FloatingMenu className={styles.FloatingMenu} editor={editor}>
              <Plus />
            </FloatingMenu>
            <BubbleMenuContent className={styles.BubbleMenu} editor={editor} />
          </EditorContent>
        )}
      </div>
    </div>
  )
}

export default Editor
