import { describe, expect, it } from 'vitest'
import { setupAuthentication } from './authentication'
import type { FindUserByEmailRepository } from '../contracts/repo/find-user-by-email'
import type { HashComparer } from '../contracts/repo/hash'

const makeHashComparer = (): HashComparer => ({
  async compare() {
    return true
  },
})

const makeUserRepository = (
  role: 'organizador' | 'visualizador' | 'participante'
): FindUserByEmailRepository => ({
  async findByEmail() {
    return {
      id: 'any_id',
      email: 'user@example.com',
      password: 'hashed',
      name: 'Test User',
      role,
      createdAt: new Date(),
    }
  },
})

describe('Authentication usecase', () => {
  const password = 'plain'
  const email = 'user@example.com'

  it.each([
    ['organizador'],
    ['visualizador'],
    ['participante'],
  ])('should authenticate %s role', async (role) => {
    const userRepo = makeUserRepository(role as any)
    const hashComparer = makeHashComparer()
    const sut = setupAuthentication(userRepo, hashComparer)

    const result = await sut({ email, password })

    expect(result).toEqual({
      loggedIn: true,
      id: 'any_id',
      name: 'Test User',
      email,
      role,
    })
  })
})
