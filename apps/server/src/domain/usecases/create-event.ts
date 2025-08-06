import type { CreateEventRepository } from '../contracts/repo/create-event'
import type { FindUserByIdRepository } from '../contracts/repo/find-user-by-id'
import { getUserPermission } from '../../utils/get-user-permission'

type Input = CreateEventRepository.Input

type Output = CreateEventRepository.Output

type Setup = (
  eventRepository: CreateEventRepository,
  userRepository: FindUserByIdRepository,
) => CreateEvent

export type CreateEvent = (input: Input) => Promise<Output>

export const setupCreateEvent: Setup = (
  eventRepository,
  userRepository,
) => async input => {
  const user = await userRepository.findById({ id: input.organizerId })
  if (!user) throw new Error('User not found')
  const { cannot } = getUserPermission(user.id, user.role)
  if (cannot('create', 'Event')) {
    throw new Error("You're not allowed")
  }
  const event = await eventRepository.create(input)
  return event
}

