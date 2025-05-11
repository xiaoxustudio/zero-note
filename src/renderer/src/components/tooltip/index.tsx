import { Tooltip, TooltipProps } from 'antd'

function TooltipWrap(props: TooltipProps) {
  return (
    <Tooltip
      arrow={false}
      style={{ zIndex: 10001 }}
      getTooltipContainer={(t) => t.parentElement!}
      mouseEnterDelay={0.25}
      {...props}
    />
  )
}
export default TooltipWrap
