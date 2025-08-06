import type { CreateEvent } from '../../domain/usecases/create-event'
import type { Controller } from '../contracts/controller'
import { ok, serverError, type HttpResponse } from '../helpers/http'

type Request = {
  title: string
  description: string
  location: string
  availableSlots: number
  eventType: 'online' | 'presencial' | 'h\u00edbrido'
  status: 'ativo' | 'cancelado'
  startDate: Date
  endDate: Date
  organizerId: string
}

export class CreateEventController implements Controller {
  constructor(private readonly createEvent: CreateEvent) {}
  async handle(request: Request): Promise<HttpResponse> {
    try {
      const event = await this.createEvent(request)
      return ok(event)
    } catch (error) {
      return serverError()
    }
  }
}

