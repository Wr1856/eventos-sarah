import { SubscribeEventController } from '../../../application/controllers/subscribe-event-controller'
import { makeSubscribeEvent } from '../usecases/subscribe-event'

export const makeSubscribeEventController = (): SubscribeEventController => {
  return new SubscribeEventController(makeSubscribeEvent())
}

