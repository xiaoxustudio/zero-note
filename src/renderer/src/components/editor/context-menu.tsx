import { Flex, FlexProps, PopoverProps } from 'antd'
import { Editor } from '@tiptap/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PopoverItem from '../popover/popver-item'
import styles from './context-menu.module.less'
import { Selection } from '@tiptap/pm/state'
import classNames from 'classnames'

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
  const [tableData, setTableData] = useState<Array<number[]>>(
    new Array(4).fill('0').map(() => new Array(4).fill('0').map(() => 0))
  )
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
      },
      {
        name: '插入',
        children: [
          {
            name: '无序列表',
            selected: editor?.isActive('bulletList'),
            click() {
              if (editor) {
                editor.chain().focus().toggleBulletList().run()
              }
            }
          },
          {
            name: '有序列表',
            selected: editor?.isActive('orderedList'),
            click() {
              if (editor) {
                editor.chain().focus().toggleOrderedList().run()
              }
            }
          },
          {
            name: '分割线',
            click() {
              if (editor) {
                editor.chain().focus().setHorizontalRule().run()
              }
            }
          },
          {
            name: '表格',
            children: [
              {
                name: (
                  <div className={styles.Table}>
                    {tableData.map((arr, ind) =>
                      arr.map((_, index) => (
                        <div
                          key={index}
                          className={classNames(
                            styles.TableCell,
                            tableData[ind][index] === 1 && styles.TableCellSelected
                          )}
                          onMouseEnter={() => setTableData(calcTableRect(ind, index))}
                        />
                      ))
                    )}
                  </div>
                )
              }
            ]
          }
        ]
      }
    ],
    // @ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, tableData, editor.state, editor.state.selection.empty]
  )
  const rectMemo = useMemo(() => {
    const length = menus.length
    const w = length * 96
    const h = length * 32
    // console.log(h, rect?.top || 0 + h, document.documentElement.offsetHeight)
    return {
      top: rect?.top
        ? rect.top + h > document.documentElement.offsetHeight
          ? document.documentElement.offsetHeight
          : rect.top - 20
        : 0,
      left: rect?.left
        ? rect.left + w > document.documentElement.offsetWidth
          ? document.documentElement.offsetWidth
          : rect.left - 120
        : 0
    }
    // @ts-ignore eslint-disable-next-line
  }, [menus.length, rect])

  // 重置表格数据
  const resetTableData = () => {
    const td = new Array(4).fill('0').map(() => new Array(4).fill('0').map(() => 0))
    setTableData(td)
    return td
  }

  // 计算矩形
  const calcTableRect = useCallback((rowsIndex: number, colsIndex: number) => {
    const newArray = new Array(4).fill(0).map(() => new Array(4).fill(0))
    const maxRow = Math.min(rowsIndex, 3)
    const maxCol = Math.min(colsIndex, 3)

    for (let i = 0; i <= maxRow; i++) {
      for (let j = 0; j <= maxCol; j++) {
        newArray[i][j] = 1
      }
    }
    return newArray
  }, [])

  useEffect(() => {
    const handle = (e) => {
      const dom = e.target as HTMLDivElement
      if (containerRef.current && !containerRef.current.contains(dom)) onClose?.()
    }
    resetTableData()
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
            top: rectMemo.top,
            left: rectMemo.left
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
