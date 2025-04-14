import { Editor, BubbleMenu, BubbleMenuProps, NodeRange } from '@tiptap/react'
import classNames from 'classnames'
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
  Palette,
  Code,
  ChevronDown
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button, Flex, Popover } from 'antd'
import { all } from 'lowlight'
import styles from './bubble-menu.module.less'

interface BubbleMenuContentProps extends Partial<BubbleMenuProps> {
  editor: Editor
}

interface configSelect {
  selectRanges: NodeRange[]
  codeType: string
}

function BubbleMenuContent({ editor, shouldShow, ...props }: BubbleMenuContentProps) {
  const ColorRef = useRef<HTMLInputElement>(null) // 文字颜色
  const BgColorRef = useRef<HTMLInputElement>(null) // 背景颜色
  const configSelect = useRef<configSelect>({ selectRanges: [], codeType: '' })
  const [codePopover, setCodePopover] = useState(false)
  const [codeSearch, setCodeSearch] = useState('')

  const handleshouldShow: BubbleMenuContentProps['shouldShow'] = ({ editor, ...reset }) => {
    const { state } = editor
    const selection = state.selection.content().content
    const currentNode = selection.content[0]
    if (!currentNode) return false
    switch (currentNode.type.name) {
      case 'image':
        return false
      default:
        return !!shouldShow?.({ editor, ...reset })
    }
  }

  useEffect(() => {
    const handleSelection = () => {
      const { state } = editor
      const { from, to } = state.selection
      const nodeRanges: NodeRange[] = []
      state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.isText) {
          return
        }

        const relativeFrom = Math.max(from, pos)
        const relativeTo = Math.min(to, pos + node.nodeSize)

        nodeRanges.push({
          node,
          from: relativeFrom,
          to: relativeTo
        })
      })
      // 将当前选择的数据存储
      configSelect.current.codeType = nodeRanges[0]?.node.attrs['language'] || ''
      configSelect.current.selectRanges = nodeRanges
    }
    editor.on('selectionUpdate', handleSelection)
    return () => {
      editor.off('selectionUpdate', handleSelection)
    }
  }, [editor])

  return (
    <BubbleMenu {...props} editor={editor} shouldShow={handleshouldShow}>
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
      {/* 文字颜色 */}
      <span
        style={{
          color: editor.getAttributes('textStyle').color,
          backgroundClip: editor.getAttributes('textStyle').color
        }}
      >
        <Baseline
          className={editor.isActive('textStyle') ? 'is-active' : ''}
          onClick={() => {
            if (!editor.isActive('textStyle')) ColorRef.current?.click?.()
            else editor.chain().focus().unsetColor().run()
          }}
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
      {/* 背景颜色 */}
      <span
        style={{
          color: editor.getAttributes('highlight').color,
          backgroundClip: editor.getAttributes('highlight').color
        }}
      >
        <Palette
          className={editor.isActive('highlight') ? 'is-active' : ''}
          onClick={() => {
            if (!editor.isActive('highlight')) BgColorRef.current?.click?.()
            else editor.chain().focus().toggleHighlight().run()
          }}
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
      <span className={styles.CodeWrapper}>
        <Code
          className={classNames(editor.isActive('codeBlock') ? 'is-active' : '')}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock({ language: configSelect.current.codeType })
              .run()
          }
        />
        <Popover
          open={codePopover}
          onOpenChange={(n) => setCodePopover(n)}
          zIndex={10000}
          content={
            <Flex
              className={styles.PopoverWrapper}
              vertical
              justify="left"
              align="start"
              onWheel={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={codeSearch}
                onChange={(e) => setCodeSearch(e.target.value)}
              />
              {Object.keys(all)
                .filter((v) => v.includes(codeSearch))
                .map((v) => (
                  <Button
                    key={v}
                    type="text"
                    onClick={() => {
                      setCodePopover(false)
                      configSelect.current.codeType = v
                      editor.chain().focus().setCodeBlock({ language: v }).run()
                    }}
                    onBlur={() => setCodeSearch('')}
                  >
                    {v}
                  </Button>
                ))}
            </Flex>
          }
          trigger="click"
          placement="right"
        >
          <ChevronDown className={styles.CodeChevronDown} />
        </Popover>
      </span>
    </BubbleMenu>
  )
}
export default BubbleMenuContent
