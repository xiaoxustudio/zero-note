import { Flex, FlexProps, Popover, PopoverProps } from 'antd'
import { useState } from 'react'
import PopoverItem from './popver-item'

interface PopoverMenuProps extends Partial<PopoverProps & FlexProps> {
  menu: Menus[]
}

export interface Menus {
  name: string
  click?: (e?: Record<string, any>) => void
  disabled?: boolean
  children?: Menus[]
}

function PopoverMenu({ menu, className, children, ...props }: PopoverMenuProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover
      {...props}
      open={open}
      onOpenChange={(n) => setOpen(n)}
      content={
        <Flex vertical justify="left" align="start" className={className}>
          {menu.map((v) => (
            <PopoverItem key={v.name} item={v} onOpenChange={(n) => setOpen(n)} />
          ))}
        </Flex>
      }
    >
      {children}
    </Popover>
  )
}
export default PopoverMenu
