import { PgRegistrationRepository } from '../../../infra/repos/postgres/registration-repository'

export const makePgRegistrationRepository = (): PgRegistrationRepository => {
  return new PgRegistrationRepository()
}

