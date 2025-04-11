import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { all, createLowlight } from 'lowlight'
import { Markdown } from 'tiptap-markdown'
import CodeBlock from './extensions/codeblock'
import CodeBlockLowlight from './extensions/code-block-lowlight'
import Image from '@tiptap/extension-image'

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
  Image,
  Highlight.configure({ multicolor: true }),
  TextStyle,
  Color.configure({ types: ['textStyle'] }),
  CodeBlockLowlight.configure({
    lowlight
  }),
  CodeBlock,
  Markdown
].filter((v) => !(['codeBlock'].includes(v.name) && !v.parent))
export default extensions
