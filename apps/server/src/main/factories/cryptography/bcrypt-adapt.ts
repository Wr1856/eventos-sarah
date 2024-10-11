import { BcryptAdapt } from '../../../infra/gateways/bcrypt-adapt'

export const makeBcryptAdapter = (): BcryptAdapt => {
  const salt = 12
  return new BcryptAdapt(salt)
}
