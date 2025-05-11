import { Copy, Minus, Square, X, File } from 'lucide-react'
import { useRef, useState } from 'react'
import { createDocFile } from '@renderer/utils'
import styles from './index.module.less'
import EventBus from '@renderer/bus'
import TooltipWrap from '../tooltip'

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
        <TooltipWrap title="新建文件" align={{ offset: [30, -10] }}>
          <File
            onClick={() => {
              createDocFile('无标题', '')
              EventBus.emit('updateSider')
            }}
          />
        </TooltipWrap>
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
        <TooltipWrap title="最小化">
          <Minus
            onClick={(e) => {
              e.stopPropagation()
              window.api.minimize()
            }}
          />
        </TooltipWrap>
        {isMaximized ? (
          <TooltipWrap title="缩小">
            <Copy onClick={handleWindowState} style={{ transform: 'rotate(90deg)' }} />
          </TooltipWrap>
        ) : (
          <TooltipWrap title="放大">
            <Square onClick={handleWindowState} />
          </TooltipWrap>
        )}
        <TooltipWrap title="关闭">
          <X
            onClick={(e) => {
              e.stopPropagation()
              window.api.close()
            }}
          />
        </TooltipWrap>
      </div>
    </div>
  )
}

export default Head
