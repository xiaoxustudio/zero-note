import EventBus from '@renderer/bus'
import { FileConfig } from '@renderer/types'
import { deleteDocFile } from '@renderer/utils'
import { Button, Flex, FlexProps } from 'antd'

interface RightContextMenuProps extends Partial<FlexProps> {
  item: FileConfig
}

function RightContextMenu({ item, ...props }: RightContextMenuProps) {
  const menus = [
    {
      name: '复制',
      click() {
        //
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
    <Flex vertical justify="left" align="start" {...props}>
      {menus.map((v) => (
        <Button key={v.name} type="text" onClick={v.click}>
          {v.name}
        </Button>
      ))}
    </Flex>
  )
}
export default RightContextMenu
