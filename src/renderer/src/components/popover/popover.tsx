import { Flex, FlexProps, Popover, PopoverProps } from 'antd'
import { useEffect, useState } from 'react'
import PopoverItem from './popver-item'
import PopoverContext from './context'
import { Menus } from './types'
import usePopItemController from '@renderer/hooks/usePopItemController'

interface PopoverMenuProps extends Partial<PopoverProps & FlexProps> {
  menu: Menus[]
}

function PopoverMenu({
  menu,
  open,
  className,
  children,
  onOpenChange,
  ...props
}: PopoverMenuProps) {
  const [innerOpen, setInnerOpen] = useState(false)
  const [hoverItem, setHoverItem] = useState<Menus>()
  const popItemC = usePopItemController()

  useEffect(() => {
    return () => {
      popItemC.clearQueue()
    }
  }, []) // eslint-disable-line

  return (
    <PopoverContext.Provider value={{ hover: hoverItem, setHover: setHoverItem }}>
      <Popover
        {...props}
        open={open !== undefined ? open : innerOpen}
        onOpenChange={(n) => {
          onOpenChange?.(n)
          setInnerOpen(n)
        }}
        content={
          <Flex vertical justify="left" align="start" className={className}>
            {menu.map((v, index) => (
              <PopoverItem
                key={index}
                item={v}
                onOpenChange={(n) => setInnerOpen(n)}
                controller={popItemC}
              />
            ))}
          </Flex>
        }
      >
        {children}
      </Popover>
    </PopoverContext.Provider>
  )
}
PopoverMenu.displayName = 'PopoverMenu'
export default PopoverMenu
