import { Button } from 'antd'
import PopoverMenu, { Menus } from './popover'
import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import styles from './popover-item.module.less'

export interface PopoverItemProps {
  item: Menus
  onOpenChange?: (n: boolean) => void
}

function PopoverItem({ item, onOpenChange }: PopoverItemProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {!item.children ? (
        <Button
          className={styles.Btn}
          key={item.name}
          type="text"
          onClick={() => {
            item.click?.()
            setOpen?.(false)
            onOpenChange?.(false)
          }}
        >
          {item.name}
        </Button>
      ) : (
        <PopoverMenu open={open} menu={item.children} placement="rightBottom">
          <Button
            className={styles.Btn}
            key={item.name}
            type="text"
            onClick={() => {
              item.click?.()
              setOpen?.(false)
              onOpenChange?.(false)
            }}
            onMouseEnter={() => {
              setOpen(true)
            }}
            onMouseLeave={() => {
              setOpen(false)
            }}
          >
            {item.name}
            {item.children && <Ellipsis className={styles.More} size={16} />}
          </Button>
        </PopoverMenu>
      )}
    </>
  )
}

export default PopoverItem
