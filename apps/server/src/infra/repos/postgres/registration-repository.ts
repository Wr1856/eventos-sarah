import { and, eq, sql } from 'drizzle-orm'
import { db } from '../../../db'
import { events, registration } from '../../../db/schema'
import type { SubscribeEventRepository } from '../../../domain/contracts/repo/subscribe-event'

export class PgRegistrationRepository implements SubscribeEventRepository {
  async checkAvailable({
    eventId,
  }: SubscribeEventRepository.CheckAvailableInput): Promise<boolean> {
    const eventAvailableSlotsCount = db.$with('event_available_slots_count').as(
      db
        .select({
          eventId: registration.eventId,
          slotsCount: sql`COUNT(${registration.id})`.as('slotsCount'),
        })
        .from(registration)
        .where(eq(registration.eventId, eventId))
        .groupBy(registration.eventId),
    )

    const [result] = await db
      .with(eventAvailableSlotsCount)
      .select({
        isAvailable: sql<boolean>`COALESCE(${events.availableSlots}, 0) > COALESCE(${eventAvailableSlotsCount.slotsCount}, 0)`,
      })
      .from(events)
      .leftJoin(
        eventAvailableSlotsCount,
        eq(events.id, eventAvailableSlotsCount.eventId),
      )
      .where(eq(events.id, eventId))
      .limit(1)

    return result?.isAvailable ?? false
  }

  async isUserRegistered({
    userId,
    eventId,
  }: SubscribeEventRepository.IsUserRegisteredInput): Promise<boolean> {
    const [already] = await db
      .select()
      .from(registration)
      .where(and(eq(registration.userId, userId), eq(registration.eventId, eventId)))
    return already !== undefined
  }

  async addSubscription({
    userId,
    eventId,
  }: SubscribeEventRepository.AddSubscriptionInput): Promise<SubscribeEventRepository.AddSubscriptionOutput> {
    const [data] = await db
      .insert(registration)
      .values({ userId, eventId })
      .returning()
    return data
  }
}

