import mitt from 'mitt'

type EventBusKeys = {
  updateSider: () => void
}

const EventBus = mitt<Record<keyof EventBusKeys, unknown>>()
export default EventBus
