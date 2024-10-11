export interface FindUserByEmailRepository {
  findByEmail: (
    input: FindUserByEmailRepository.Input
  ) => Promise<FindUserByEmailRepository.Output>
}

export namespace FindUserByEmailRepository {
  export type Input = {
    email: string
  }
  export type Output = {
    email: string
    password: string
    name: string
    role: 'organizador' | 'participante' | 'visualizador'
    id: string
    createdAt: Date
  }
}
