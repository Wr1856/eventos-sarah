import {
  setupSubscribeEvent,
  type SubscribeEvent,
} from '../../../domain/usecases/subscribe-event'
import { makePgRegistrationRepository } from '../repositories/registration'
import { makePgUserAccountRepository } from '../repositories/user-account'

export const makeSubscribeEvent = (): SubscribeEvent => {
  return setupSubscribeEvent(
    makePgRegistrationRepository(),
    makePgUserAccountRepository(),
  )
}

