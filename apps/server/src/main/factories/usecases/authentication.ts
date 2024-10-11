import {
  setupAuthentication,
  type Authentication,
} from '../../../domain/usecases/authentication'
import { makeBcryptAdapter } from '../cryptography/bcrypt-adapt'
import { makePgUserAccountRepository } from '../repositories/user-account'

export const makeAuthentication = (): Authentication => {
  return setupAuthentication(makePgUserAccountRepository(), makeBcryptAdapter())
}
