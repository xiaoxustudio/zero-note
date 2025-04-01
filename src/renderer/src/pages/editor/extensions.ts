import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import CodeBlock from './extensions/codeblock'

const lowlight = createLowlight(all)

const extensions = [
  StarterKit.configure({
    bold: {
      HTMLAttributes: {
        class: 'bold'
      }
    },
    codeBlock: false
  }),
  Highlight.configure({ multicolor: true }),
  TextStyle,
  Color.configure({ types: ['textStyle'] }),
  CodeBlockLowlight.configure({
    lowlight
  }),
  CodeBlock
]
export default extensions
