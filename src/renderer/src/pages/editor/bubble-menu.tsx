import { Editor, BubbleMenu, BubbleMenuProps } from '@tiptap/react'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Baseline,
  Palette
} from 'lucide-react'
import { useRef } from 'react'

interface BubbleMenuContentProps extends Partial<BubbleMenuProps> {
  editor: Editor
}

function BubbleMenuContent({ editor, ...props }: BubbleMenuContentProps) {
  const ColorRef = useRef<HTMLInputElement>(null) // 文字颜色
  const BgColorRef = useRef<HTMLInputElement>(null) // 背景颜色
  return (
    <BubbleMenu {...props} editor={editor}>
      <Bold
        className={editor.isActive('bold') ? 'is-active' : ''}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <Italic
        className={editor.isActive('italic') ? 'is-active' : ''}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <Heading1
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <Heading2
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <Heading3
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <Heading4
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      />
      <Heading5
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      />
      <Heading6
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
      />
      <span
        style={{
          color: editor.getAttributes('color').color,
          backgroundClip: editor.getAttributes('color').color
        }}
      >
        <Baseline
          className={editor.isActive('color') ? 'is-active' : ''}
          onClick={() => ColorRef.current?.click?.()}
        />
        <input
          ref={ColorRef}
          type="color"
          style={{ visibility: 'hidden', width: 0, height: 0, padding: 0, margin: 0 }}
          onChange={(e) => {
            editor.chain().focus().setColor(e.target.value).run()
          }}
        />
      </span>
      <span
        style={{
          color: editor.getAttributes('highlight').color,
          backgroundClip: editor.getAttributes('highlight').color
        }}
      >
        <Palette
          className={editor.isActive('highlight') ? 'is-active' : ''}
          onClick={() => BgColorRef.current?.click?.()}
        />
        <input
          ref={BgColorRef}
          type="color"
          style={{ visibility: 'hidden', width: 0, height: 0, padding: 0, margin: 0 }}
          onChange={(e) => {
            editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
          }}
        />
      </span>
    </BubbleMenu>
  )
}
export default BubbleMenuContent
