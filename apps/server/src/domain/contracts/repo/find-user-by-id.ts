import { type Role } from '@next-acl/auth'

export namespace FindUserByIdRepository {
  export type Input = { id: string }
  export type Output = { id: string; role: Role } | undefined
}

export interface FindUserByIdRepository {
  findById: (
    input: FindUserByIdRepository.Input,
  ) => Promise<FindUserByIdRepository.Output>
}

