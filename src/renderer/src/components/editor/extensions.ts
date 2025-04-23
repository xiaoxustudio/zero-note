import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { all, createLowlight } from 'lowlight'
import { Markdown } from 'tiptap-markdown'
import CodeBlock from './extensions/code-block'
import CodeBlockLowlight from './extensions/code-block-lowlight'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

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
  Markdown,
  Table,
  TableRow,
  TableHeader,
  TableCell
].filter((v) => !(['codeBlock'].includes(v.name) && !v.parent))
export default extensions
