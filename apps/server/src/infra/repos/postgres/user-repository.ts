import { eq } from 'drizzle-orm'
import { db } from '../../../db'
import { users } from '../../../db/schema'
import type { FindUserByEmailRepository } from '../../../domain/contracts/repo/find-user-by-email'
import type { FindUserByIdRepository } from '../../../domain/contracts/repo/find-user-by-id'

export class PgUserAccountRepository implements FindUserByEmailRepository, FindUserByIdRepository {
  async findByEmail({
    email,
  }: FindUserByEmailRepository.Input): Promise<FindUserByEmailRepository.Output> {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user
  }

  async findById({
    id,
  }: FindUserByIdRepository.Input): Promise<FindUserByIdRepository.Output> {
    const [user] = await db.select().from(users).where(eq(users.id, id))
    return user
  }
}

