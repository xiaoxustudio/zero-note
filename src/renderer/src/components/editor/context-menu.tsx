import { Flex, FlexProps, PopoverProps } from 'antd'
import { Editor } from '@tiptap/react'
import { useEffect, useMemo, useRef } from 'react'
import PopoverItem from '../popover/popver-item'
import styles from './context-menu.module.less'
import { Selection } from '@tiptap/pm/state'

interface EditorRightContextMenuProps extends Partial<PopoverProps & FlexProps> {
  editor?: Editor
  rect?: DOMRect
  selection?: Selection
  open: boolean
  onClose?: () => void
}

function EditorRightContextMenu({
  open,
  editor,
  rect,
  onClose,
  ...props
}: EditorRightContextMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const menus = useMemo(
    () => [
      {
        name: '复制',
        disabled: !editor || editor.state.selection.empty,
        async click(e) {
          if (editor) {
            try {
              const { from, to } = editor.state.selection
              const text = editor.state.doc.textBetween(from, to, ' ')

              await navigator.clipboard.writeText(text)
            } catch {
              /* empty */
            }
          }
          e.onClose()
        }
      },
      {
        name: '粘贴',
        disabled: !editor || editor.state.selection.empty,
        async click(e) {
          if (editor) {
            try {
              const text = await navigator.clipboard.readText()
              editor.commands.insertContent(text)
            } catch {
              /* empty */
            }
          }
          e.onClose()
        }
      },
      {
        name: '剪切',
        disabled: !editor || editor.state.selection.empty,
        async click(e) {
          if (editor) {
            try {
              const { from, to } = editor.state.selection
              const text = editor.state.doc.textBetween(from, to, ' ')
              console.log(text)

              await navigator.clipboard.writeText(text)
              editor.commands.deleteSelection() // 删除选中内容
            } catch {
              /* empty */
            }
            e.onClose()
          }
        }
      }
    ],
    // @ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, editor.state.selection.empty]
  )
  useEffect(() => {
    const handle = (e) => {
      const dom = e.target as HTMLDivElement
      if (containerRef.current && !containerRef.current.contains(dom)) onClose?.()
    }
    window.addEventListener('click', handle)
    return () => {
      window.removeEventListener('click', handle)
    }
  }, [onClose])

  if (!editor) return null
  return (
    <>
      {open ? (
        <div
          ref={containerRef}
          className={styles.ContextMenu}
          style={{
            top: rect?.top ? rect.top - 20 : 0,
            left: rect?.left ? rect.left - 120 : 0
          }}
          {...props}
        >
          <Flex vertical justify="left" align="start">
            {menus.map((v) => (
              <PopoverItem key={v.name} item={v} eventInject={{ click: { onClose } }} />
            ))}
          </Flex>
        </div>
      ) : null}
    </>
  )
}
export default EditorRightContextMenu
