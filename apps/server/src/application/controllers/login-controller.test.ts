import { describe, expect, it, vi } from 'vitest'
import { LoginController } from './login-controller'
import { HttpStatusCode } from '../helpers/http'

describe('LoginController', () => {
  const email = 'test@example.com'
  const password = 'secret'
  const userData = {
    loggedIn: true,
    role: 'user',
    id: 'any_id',
    name: 'Test',
    email,
  }

  it('should return 200 with user data when authentication succeeds', async () => {
    const authentication = vi.fn().mockResolvedValue(userData)
    const sut = new LoginController(authentication)

    const result = await sut.handle({ email, password })

    expect(result.statusCode).toBe(HttpStatusCode.OK)
    expect(result.data).toEqual(userData)
  })

  it('should return serverError when authentication throws', async () => {
    const authentication = vi.fn().mockRejectedValue(new Error('any_error'))
    const sut = new LoginController(authentication)

    const result = await sut.handle({ email, password })

    expect(result.statusCode).toBe(HttpStatusCode.ServerError)
    expect(result.data).toEqual(new Error('An unexpected erro has ocurred'))
  })
})
