import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { all, createLowlight } from 'lowlight'
import CodeBlock from './extensions/codeblock'
import CodeBlockLowlight from './extensions/code-block-lowlight'

const lowlight = createLowlight(all)

const extensions = [
  StarterKit.configure({
    codeBlock: false,
    bold: {
      HTMLAttributes: {
        class: 'bold'
      }
    }
  }),
  Highlight.configure({ multicolor: true }),
  TextStyle,
  Color.configure({ types: ['textStyle'] }),
  CodeBlockLowlight.configure({
    lowlight
  }),
  CodeBlock
].filter((v) => !(['codeBlock'].includes(v.name) && !v.parent))
export default extensions
