import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'

// Declare mocks
var selectMock: ReturnType<typeof vi.fn>
var insertMock: ReturnType<typeof vi.fn>
var updateMock: ReturnType<typeof vi.fn>
var deleteMock: ReturnType<typeof vi.fn>
var whereMock: ReturnType<typeof vi.fn>
var returningMock: ReturnType<typeof vi.fn>
var withMock: ReturnType<typeof vi.fn>
var $withMock: ReturnType<typeof vi.fn>
var limitMock: ReturnType<typeof vi.fn>
var cannotMock: ReturnType<typeof vi.fn>
var emitMock: ReturnType<typeof vi.fn>

vi.mock('../db', () => {
  whereMock = vi.fn()
  returningMock = vi.fn()
  limitMock = vi.fn()
  selectMock = vi.fn()
  insertMock = vi.fn()
  updateMock = vi.fn()
  deleteMock = vi.fn()
  withMock = vi.fn()
  $withMock = vi.fn(() => ({ as: vi.fn() }))
  return {
    db: {
      select: selectMock,
      insert: insertMock,
      update: updateMock,
      delete: deleteMock,
      with: withMock,
      $with: $withMock,
    },
  }
})

vi.mock('../utils/get-user-permission', () => {
  cannotMock = vi.fn()
  return {
    getUserPermission: vi.fn(() => ({ cannot: cannotMock })),
  }
})

vi.mock('../lib/event-emiter', () => {
  emitMock = vi.fn()
  return {
    EventEmitter: () => ({
      emit: emitMock,
      on: vi.fn(),
      off: vi.fn(),
    }),
  }
})

vi.mock('@next-acl/auth', () => ({
  eventSchema: { parse: vi.fn((v) => v) },
}))

import { registerRoutes } from './events'

describe('Event routes', () => {
  let app: ReturnType<typeof Fastify>

  beforeEach(async () => {
    app = Fastify().withTypeProvider<ZodTypeProvider>()
    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)
    await app.register(registerRoutes)
  })

  afterEach(async () => {
    await app.close()
    vi.clearAllMocks()
    selectMock.mockReset()
    insertMock.mockReset()
    updateMock.mockReset()
    deleteMock.mockReset()
    whereMock.mockReset()
    returningMock.mockReset()
    withMock.mockReset()
    $withMock.mockReset()
    limitMock.mockReset()
    cannotMock.mockReset()
    emitMock.mockReset()
  })

  it('should create a new event', async () => {
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ id: 'user1', role: 'organizador' }]) })),
    })
    cannotMock.mockReturnValueOnce(false)
    insertMock.mockReturnValueOnce({
      values: vi.fn(() => ({ returning: returningMock })),
    })
    returningMock.mockResolvedValueOnce([
      {
        id: 'event1',
        title: 'Event',
        organizerId: 'user1',
      },
    ])

    const response = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: 'Event',
        description: 'desc',
        eventType: 'online',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        location: 'loc',
        availableSlots: 10,
        status: 'ativo',
        organizerId: 'user1',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      event: { id: 'event1', title: 'Event', organizerId: 'user1' },
    })
  })

  it('should not allow event creation without permission', async () => {
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ id: 'user1', role: 'organizador' }]) })),
    })
    cannotMock.mockReturnValueOnce(true)

    const response = await app.inject({
      method: 'POST',
      url: '/events',
      payload: {
        title: 'Event',
        description: 'desc',
        eventType: 'online',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        location: 'loc',
        availableSlots: 10,
        status: 'ativo',
        organizerId: 'user1',
      },
    })

    expect(response.statusCode).toBe(403)
    expect(JSON.parse(response.body)).toEqual({ error: "You're not allowed" })
  })

  it('should subscribe user to event', async () => {
    // event exists
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ id: 'event1', availableSlots: 10, organizerId: 'org' }]) })),
    })
    // user exists
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ id: 'user1', role: 'participante' }]) })),
    })
    cannotMock.mockReturnValueOnce(false)
    // subquery for slots
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn(() => ({ groupBy: vi.fn() })) })),
    })
    // availability check
    $withMock.mockReturnValueOnce({ as: vi.fn(() => ({ eventId: 'e', slotsCount: 's' })) })
    withMock.mockReturnValueOnce({
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          leftJoin: vi.fn(() => ({
            where: vi.fn(() => ({ limit: limitMock })),
          })),
        })),
      })),
    })
    limitMock.mockResolvedValueOnce([{ isAvailable: true }])
    // already subscribed check
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([]) })),
    })
    // insert registration
    insertMock.mockReturnValueOnce({
      values: vi.fn(() => ({ returning: returningMock })),
    })
    returningMock.mockResolvedValueOnce([
      { id: 'reg1', userId: 'user1', eventId: 'event1' },
    ])
    // fetch user info for emitter
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          leftJoin: vi.fn().mockResolvedValueOnce([
            {
              id: 'reg1',
              name: 'User',
              email: 'user@example.com',
              registrationDate: new Date().toISOString(),
            },
          ]),
        })),
      })),
    })

    const response = await app.inject({
      method: 'PATCH',
      url: '/event/event1/subscribe',
      payload: { userId: 'user1' },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      registration: { id: 'reg1', userId: 'user1', eventId: 'event1' },
    })
    expect(emitMock).toHaveBeenCalledWith('event1', {
      key: 'user_registration',
      message: {
        id: 'reg1',
        name: 'User',
        email: 'user@example.com',
        registrationDate: expect.any(String),
      },
    })
  })

  it('should not subscribe user without permission', async () => {
    // event exists
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ id: 'event1', organizerId: 'org' }]) })),
    })
    // user exists
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ id: 'user1', role: 'participante' }]) })),
    })
    cannotMock.mockReturnValueOnce(true)

    const response = await app.inject({
      method: 'PATCH',
      url: '/event/event1/subscribe',
      payload: { userId: 'user1' },
    })

    expect(response.statusCode).toBe(403)
    expect(JSON.parse(response.body)).toEqual({
      error: 'You are not allowed to subscribe in event',
    })
  })

  it('should cancel an event', async () => {
    // event data
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ organizerId: 'user1' }]) })),
    })
    // user data
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ id: 'user1', role: 'organizador' }]) })),
    })
    cannotMock.mockReturnValueOnce(false)
    updateMock.mockReturnValueOnce({
      set: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ id: 'event1', status: 'cancelado' }]) })),
    })

    const response = await app.inject({
      method: 'PATCH',
      url: '/event/event1/cancel',
      payload: { userId: 'user1' },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      event: { id: 'event1', status: 'cancelado' },
    })
  })

  it('should get an event by id', async () => {
    // subquery
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ groupBy: vi.fn() })),
    })
    $withMock.mockReturnValueOnce({ as: vi.fn(() => ({ eventId: 'e', slotsCount: 's' })) })
    withMock.mockReturnValueOnce({
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            leftJoin: vi.fn(() => ({
              leftJoin: vi.fn().mockResolvedValueOnce([
                {
                  id: 'event1',
                  title: 'Event',
                  organizer: { id: 'user1', name: 'User' },
                },
              ]),
            })),
          })),
        })),
      })),
    })

    const response = await app.inject({
      method: 'GET',
      url: '/event/event1',
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      id: 'event1',
      title: 'Event',
      organizer: { id: 'user1', name: 'User' },
    })
  })

  it('should delete an event', async () => {
    // event data
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ organizerId: 'user1' }]) })),
    })
    // user data
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ id: 'user1', role: 'organizador' }]) })),
    })
    cannotMock.mockReturnValueOnce(false)
    deleteMock.mockReturnValueOnce({
      where: vi.fn(() => ({ returning: returningMock })),
    })
    returningMock.mockResolvedValueOnce([{ id: 'event1' }])

    const response = await app.inject({
      method: 'DELETE',
      url: '/event/event1/user1',
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({ event: { id: 'event1' } })
  })

  it('should not delete an event without permission', async () => {
    // event data
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ organizerId: 'user1' }]) })),
    })
    // user data
    selectMock.mockReturnValueOnce({
      from: vi.fn(() => ({ where: vi.fn().mockResolvedValueOnce([{ id: 'user1', role: 'organizador' }]) })),
    })
    cannotMock.mockReturnValueOnce(true)

    const response = await app.inject({
      method: 'DELETE',
      url: '/event/event1/user1',
    })

    expect(response.statusCode).toBe(403)
    expect(JSON.parse(response.body)).toEqual({ error: "This event are not your!" })
  })
})

