import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const rolesEnum = pgEnum('roles', [
  'participante',
  'visualizador',
  'organizador',
])

export const eventTypes = pgEnum('event_type', [
  'online',
  'presencial',
  'híbrido',
])

export const statusEnum = pgEnum('status', ['ativo', 'cancelado'])

export const users = table('users', {
  id: t
    .text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: t.text('name').notNull(),
  email: t.text('email').unique().notNull(),
  password: t.text('password').notNull(),
  role: rolesEnum().notNull().default('participante'),
  createdAt: t.timestamp('created_at').notNull().defaultNow(),
})

export const events = table('events', {
  id: t
    .text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: t.text('title').notNull(),
  description: t.text('description').notNull(),
  startDate: t.timestamp('start_date').notNull(),
  endDate: t.timestamp('end_date').notNull(),
  location: t.text('location').notNull(),
  availableSlots: t.integer('available_slots'),
  eventType: eventTypes('event_type').notNull(),
  status: statusEnum('status').default('ativo').notNull(),
  organizerId: t
    .text('organizer_id')
    .references(() => users.id)
    .notNull(),
})

export const registration = table('registration', {
  id: t
    .text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: t
    .text('user_id')
    .references(() => users.id)
    .notNull(),
  eventId: t
    .text('event_id')
    .references(() => events.id)
    .notNull(),
  registrationDate: t.timestamp('registration_date').notNull().defaultNow(),
})
