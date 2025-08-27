import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'

// Declare mocks to be assigned inside vi.mock factories
var whereMock: ReturnType<typeof vi.fn>
var returningMock: ReturnType<typeof vi.fn>
var selectMock: ReturnType<typeof vi.fn>
var insertMock: ReturnType<typeof vi.fn>

vi.mock('../db', () => {
  whereMock = vi.fn()
  returningMock = vi.fn()
  selectMock = vi.fn(() => ({ from: vi.fn(() => ({ where: whereMock })) }))
  insertMock = vi.fn(() => ({ values: vi.fn(() => ({ returning: returningMock })) }))
  return {
    db: {
      select: selectMock,
      insert: insertMock,
    },
  }
})

var hashMock: ReturnType<typeof vi.fn>
vi.mock('bcrypt', () => {
  hashMock = vi.fn().mockResolvedValue('hashed')
  return {
    default: {
      hash: hashMock,
    },
  }
})

var handleMock: ReturnType<typeof vi.fn>
vi.mock('../main/factories/controller/login', () => {
  handleMock = vi.fn().mockResolvedValue({
    statusCode: 200,
    data: {
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      role: 'participante',
    },
  })
  return {
    makeLoginController: () => ({
      handle: handleMock,
    }),
  }
})

import { registerRoutes } from './users'

describe('User routes', () => {
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
  })

  it('should register a new user', async () => {
    whereMock.mockResolvedValueOnce([])
    returningMock.mockResolvedValueOnce([
      {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'hashed',
        role: 'participante',
      },
    ])

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'John',
        email: 'john@example.com',
        password: 'secret',
        role: 'participante',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      user: {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'hashed',
        role: 'participante',
      },
    })
    expect(hashMock).toHaveBeenCalledWith('secret', 12)
  })

  it('should not allow registration with duplicated email', async () => {
    whereMock.mockResolvedValueOnce([{ email: 'john@example.com' }])

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'John',
        email: 'john@example.com',
        password: 'secret',
        role: 'participante',
      },
    })

    expect(response.statusCode).toBe(409)
    expect(JSON.parse(response.body)).toEqual({
      message: 'Email already exists in system!',
    })
  })

  it('should login user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'test@example.com',
        password: 'secret',
      },
    })

    expect(handleMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secret',
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      role: 'participante',
    })
  })
})
