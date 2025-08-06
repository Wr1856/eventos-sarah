import { PgEventRepository } from '../../../infra/repos/postgres/event-repository'

export const makePgEventRepository = (): PgEventRepository => {
  return new PgEventRepository()
}

