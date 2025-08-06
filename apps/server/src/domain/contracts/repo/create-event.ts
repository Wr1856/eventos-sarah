export namespace CreateEventRepository {
  export type Input = {
    title: string
    description: string
    location: string
    availableSlots: number
    eventType: "online" | "presencial" | "híbrido"
    status: "ativo" | "cancelado"
    startDate: Date
    endDate: Date
    organizerId: string
  }
  export type Output = Input & { id: string; createdAt: Date }
}

export interface CreateEventRepository {
  create: (
    input: CreateEventRepository.Input,
  ) => Promise<CreateEventRepository.Output>
}

