import { db } from '../../../db'
import { events } from '../../../db/schema'
import type { CreateEventRepository } from '../../../domain/contracts/repo/create-event'

export class PgEventRepository implements CreateEventRepository {
  async create(
    input: CreateEventRepository.Input,
  ): Promise<CreateEventRepository.Output> {
    const [event] = await db.insert(events).values(input).returning()
    return {
      ...event,
      availableSlots: event.availableSlots ?? 0,
    }
  }
}

