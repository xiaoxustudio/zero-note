import { ReactNode } from 'react'

export interface Menus {
  name: string | ReactNode
  click?: (e?: Record<string, any>) => void
  disabled?: boolean
  children?: Menus[]
  selected?: boolean
  persist?: boolean // 持久化显示
}
