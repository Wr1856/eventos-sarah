export namespace SubscribeEventRepository {
  export type CheckAvailableInput = { eventId: string }
  export type IsUserRegisteredInput = { eventId: string; userId: string }
  export type AddSubscriptionInput = { eventId: string; userId: string }
  export type AddSubscriptionOutput = {
    id: string
    userId: string
    eventId: string
    registrationDate: Date
  }
}

export interface SubscribeEventRepository {
  checkAvailable: (
    input: SubscribeEventRepository.CheckAvailableInput,
  ) => Promise<boolean>
  isUserRegistered: (
    input: SubscribeEventRepository.IsUserRegisteredInput,
  ) => Promise<boolean>
  addSubscription: (
    input: SubscribeEventRepository.AddSubscriptionInput,
  ) => Promise<SubscribeEventRepository.AddSubscriptionOutput>
}

