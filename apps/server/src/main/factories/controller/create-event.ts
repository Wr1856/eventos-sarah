import { CreateEventController } from '../../../application/controllers/create-event-controller'
import { makeCreateEvent } from '../usecases/create-event'

export const makeCreateEventController = (): CreateEventController => {
  return new CreateEventController(makeCreateEvent())
}

