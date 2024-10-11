import type { FindUserByEmailRepository } from '../contracts/repo/find-user-by-email'
import type { HashComparer } from '../contracts/repo/hash'

type Output = { loggedIn: true }
type Input = {
  email: string
  password: string
}
type Setup = (
  userRepository: FindUserByEmailRepository,
  hashComparer: HashComparer
) => Authentication

export type Authentication = (input: Input) => Promise<Output>

export const setupAuthentication: Setup =
  (userAccountRepo, hashComparer) => async input => {
    const user = await userAccountRepo.findByEmail(input)
    if (user) {
      const isValid = await hashComparer.compare(input.password, user.password)
      if (isValid) {
        return { loggedIn: true }
      }
    }
    throw new Error('The data provided is invalid.')
  }
