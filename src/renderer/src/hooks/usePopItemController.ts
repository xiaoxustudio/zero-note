import { useRef } from 'react'

export interface usePopItemControllerT {
  push: (name: string, fn: () => void) => void
  closeAll: () => void
  clearQueue: () => void
}

function usePopItemController<T = usePopItemControllerT>(): T {
  const queue = useRef<{ [k: string]: () => void }>({}) // 关闭stack
  return {
    push(name, fn) {
      queue.current[name] = fn
    },
    closeAll() {
      Object.keys(queue.current).forEach((id) => {
        queue.current[id]()
      })
    },
    clearQueue() {
      queue.current = {}
    }
  } as T
}

export default usePopItemController
