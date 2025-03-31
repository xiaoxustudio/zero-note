import { Copy, Minus, Square, X, File } from 'lucide-react'
import { useRef, useState } from 'react'
import { createDocFile } from '@renderer/utils'
import styles from './index.module.less'
import EventBus from '@renderer/bus'

function Head() {
  const [isMaximized, setMaximized] = useState(window.api.isMaximized())
  const canMoving = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })

  const handleWindowState = (e) => {
    e.stopPropagation()
    window.api.maximize()
    setMaximized(window.api.isMaximized())
  }

  const handleMoveWindow = (e: MouseEvent) => {
    if (canMoving.current) {
      const deltaX = e.screenX - startPos.current.x
      const deltaY = e.screenY - startPos.current.y
      startPos.current = {
        x: e.screenX,
        y: e.screenY
      }
      window.api.setWindowPos(Math.round(deltaX), Math.round(deltaY))
    }
  }
  const handleMoveDone = () => {
    canMoving.current = false
    window.removeEventListener('mousemove', handleMoveWindow)
  }

  return (
    <div className={styles.Head}>
      <div className={styles.Left}>
        <File
          onClick={() => {
            createDocFile('无标题', '')
            EventBus.emit('updateSider')
          }}
        />
      </div>
      <div
        className={styles.Midden}
        onMouseDown={(e) => {
          startPos.current.x = e.clientX
          startPos.current.y = e.clientY
          canMoving.current = true
          window.addEventListener('mousemove', handleMoveWindow)
          window.addEventListener('mouseup', handleMoveDone)
        }}
      >
        {window.api.getTitle()}
      </div>
      <div className={styles.Right}>
        <Minus
          onClick={(e) => {
            e.stopPropagation()
            window.api.minimize()
          }}
        />
        {isMaximized ? (
          <Copy onClick={handleWindowState} style={{ transform: 'rotate(90deg)' }} />
        ) : (
          <Square onClick={handleWindowState} />
        )}
        <X
          onClick={(e) => {
            e.stopPropagation()
            window.api.close()
          }}
        />
      </div>
    </div>
  )
}

export default Head
