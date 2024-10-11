import { PgUserAccountRepository } from '../../../infra/repos/postgres/user-repository'

export const makePgUserAccountRepository = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
