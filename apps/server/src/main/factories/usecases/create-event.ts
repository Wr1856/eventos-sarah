import {
  setupCreateEvent,
  type CreateEvent,
} from '../../../domain/usecases/create-event'
import { makePgEventRepository } from '../repositories/event'
import { makePgUserAccountRepository } from '../repositories/user-account'

export const makeCreateEvent = (): CreateEvent => {
  return setupCreateEvent(
    makePgEventRepository(),
    makePgUserAccountRepository(),
  )
}

