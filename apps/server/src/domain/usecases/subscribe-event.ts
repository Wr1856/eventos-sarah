import type { SubscribeEventRepository } from '../contracts/repo/subscribe-event'
import type { FindUserByIdRepository } from '../contracts/repo/find-user-by-id'
import { getUserPermission } from '../../utils/get-user-permission'

interface Input {
  eventId: string
  userId: string
}

type Output = SubscribeEventRepository.AddSubscriptionOutput

type Setup = (
  subscribeRepository: SubscribeEventRepository,
  userRepository: FindUserByIdRepository,
) => SubscribeEvent

export type SubscribeEvent = (input: Input) => Promise<Output>

export const setupSubscribeEvent: Setup = (
  subscribeRepository,
  userRepository,
) => async ({ eventId, userId }) => {
  const user = await userRepository.findById({ id: userId })
  if (!user) throw new Error('User not found')
  const { cannot } = getUserPermission(user.id, user.role)
  if (cannot('subscribe', 'Event')) {
    throw new Error('You are not allowed to subscribe in event')
  }
  const isAvailable = await subscribeRepository.checkAvailable({ eventId })
  if (!isAvailable) {
    throw new Error('this spots for this event are sold out.')
  }
  const alreadySubscribed = await subscribeRepository.isUserRegistered({
    userId,
    eventId,
  })
  if (alreadySubscribed) {
    throw new Error(
      'You cannot register for an event that you have already registered for.',
    )
  }
  const registration = await subscribeRepository.addSubscription({
    userId,
    eventId,
  })
  return registration
}

