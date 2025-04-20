import { createContext, SetStateAction } from 'react'
import { Menus } from './types'

interface PopoverContextProps {
  hover?: Menus
  setHover?: SetStateAction<Menus>
  closeCurrentPopover?: () => void // 关闭当前层级弹出
}

const PopoverContext = createContext<PopoverContextProps>({})
export default PopoverContext
