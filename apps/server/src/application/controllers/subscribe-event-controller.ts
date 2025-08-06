import type { SubscribeEvent } from '../../domain/usecases/subscribe-event'
import type { Controller } from '../contracts/controller'
import { ok, serverError, type HttpResponse } from '../helpers/http'

type Request = {
  eventId: string
  userId: string
}

export class SubscribeEventController implements Controller {
  constructor(private readonly subscribeEvent: SubscribeEvent) {}
  async handle({ eventId, userId }: Request): Promise<HttpResponse> {
    try {
      const registration = await this.subscribeEvent({ eventId, userId })
      return ok({ registration })
    } catch (error) {
      return serverError()
    }
  }
}

