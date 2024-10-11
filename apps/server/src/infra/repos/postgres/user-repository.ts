import { eq } from 'drizzle-orm'
import { db } from '../../../db'
import { users } from '../../../db/schema'
import type { FindUserByEmailRepository } from '../../../domain/contracts/repo/find-user-by-email'

export class PgUserAccountRepository implements FindUserByEmailRepository {
  async findByEmail({
    email,
  }: FindUserByEmailRepository.Input): Promise<FindUserByEmailRepository.Output> {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user
  }
}
