import EventBus from '@renderer/bus'
import { FileConfig } from '@renderer/types'
import { CopyDocFile, deleteDocFile } from '@renderer/utils'
import { Button, Flex, FlexProps, Popover, PopoverProps } from 'antd'
import { useState } from 'react'

interface RightContextMenuProps extends Partial<PopoverProps & FlexProps> {
  item: FileConfig
}

function RightContextMenu({ item, className, children, ...props }: RightContextMenuProps) {
  const [open, setOpen] = useState(false)
  const menus = [
    {
      name: '复制',
      click() {
        CopyDocFile(item.id, { title: item.title + '- 副本' }).then(() => {
          EventBus.emit('updateSider')
        })
      }
    },
    {
      name: '剪切',
      click() {
        //
      }
    },
    {
      name: '删除',
      click() {
        deleteDocFile(item.id)
        EventBus.emit('updateSider')
      }
    },
    {
      name: '在资源管理器中打开',
      click() {
        window.api.openPath(item.realFilePath.substring(0, item.realFilePath.lastIndexOf('\\')))
      }
    }
  ]
  return (
    <Popover
      {...props}
      open={open}
      onOpenChange={(n) => setOpen(n)}
      content={
        <Flex vertical justify="left" align="start" className={className}>
          {menus.map((v) => (
            <Button
              key={v.name}
              type="text"
              onClick={() => {
                v.click?.()
                setOpen(false)
              }}
            >
              {v.name}
            </Button>
          ))}
        </Flex>
      }
    >
      {children}
    </Popover>
  )
}
export default RightContextMenu
