import { Button } from 'antd'
import PopoverMenu, { Menus } from './popover'
import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import styles from './popover-item.module.less'
import classNames from 'classnames'

type EventInjectType = {
  [k in keyof WindowEventMap]?: Record<string, any>
}

export interface PopoverItemProps {
  item: Menus
  onOpenChange?: (n: boolean) => void
  eventInject?: EventInjectType
}

function PopoverItem({ item, eventInject, onOpenChange }: PopoverItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {!item.children || item.disabled ? (
        <Button
          className={classNames(styles.Btn, item?.selected && styles.Selected)}
          key={item.name}
          type="text"
          onClick={() => {
            item.click?.(eventInject ? eventInject['click'] : undefined)
            setOpen?.(false)
            onOpenChange?.(false)
          }}
          disabled={item.disabled}
        >
          {item.name}
        </Button>
      ) : (
        <PopoverMenu open={open} menu={item.children} placement="rightBottom">
          <Button
            className={classNames(styles.Btn, item?.selected && styles.Selected)}
            key={item.name}
            type="text"
            onClick={() => {
              item.click?.(eventInject ? eventInject['click'] : undefined)
              setOpen?.(false)
              onOpenChange?.(false)
            }}
            onMouseEnter={() => {
              if (!item.disabled) return
              setOpen(true)
            }}
            onMouseLeave={() => {
              if (!item.disabled) return
              setOpen(false)
            }}
            disabled={item.disabled}
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
