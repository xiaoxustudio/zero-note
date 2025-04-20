import { Button } from 'antd'
import PopoverMenu from './popover'
import { Ellipsis } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import styles from './popover-item.module.less'
import classNames from 'classnames'
import { Menus } from './types'
import { usePopItemControllerT } from '@renderer/hooks/usePopItemController'
import { ID } from '@renderer/utils'

type EventInjectType = {
  [k in keyof WindowEventMap]?: Record<string, any>
}

export interface PopoverItemProps {
  item: Menus
  onOpenChange?: (n: boolean) => void
  eventInject?: EventInjectType
  controller?: usePopItemControllerT
}

function PopoverItem({ item, eventInject, controller, onOpenChange }: PopoverItemProps) {
  const [open, setOpen] = useState(false)
  const ids = useRef(ID())

  useEffect(() => {
    controller?.push(ids.current, () => {
      setOpen(false)
      onOpenChange?.(false)
    })
  }, [controller, onOpenChange])

  return (
    <>
      {!item.children || item.disabled ? (
        typeof item.name === 'string' ? (
          <Button
            className={classNames(styles.Btn, item?.selected && styles.Selected)}
            key={item.name?.toString()}
            type="text"
            onClick={() => {
              item.click?.(eventInject ? eventInject['click'] : undefined)
              setOpen?.(false)
              onOpenChange?.(false)
            }}
            onMouseEnter={() => {
              controller?.closeAll()
            }}
            disabled={item.disabled}
          >
            {item.name}
          </Button>
        ) : (
          <>{item.name}</>
        )
      ) : (
        <PopoverMenu
          open={open}
          menu={item.children}
          placement="rightBottom"
          trigger={'hover'}
          onOpenChange={(n) => {
            if (item.persist && !n) setOpen(n)
            onOpenChange?.(n)
          }}
        >
          <Button
            className={classNames(styles.Btn, item?.selected && styles.Selected)}
            key={item.name?.toString()}
            type="text"
            onClick={() => {
              item.click?.(eventInject ? eventInject['click'] : undefined)
              setOpen?.(false)
              onOpenChange?.(false)
            }}
            onMouseEnter={() => {
              if (item.disabled) return
              setOpen(true)
              onOpenChange?.(true)
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
