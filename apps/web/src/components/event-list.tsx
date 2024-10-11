'use client'

import { useQuery } from "@tanstack/react-query"
import { setDefaultOptions } from "date-fns";
import { ptBR } from 'date-fns/locale'

setDefaultOptions({ locale: ptBR })

import { api } from "@/lib/api"
import { EventRow } from "./event-row"

export type Events = Event[]

export interface Event {
  id: string
  title: string
  description: string
  location: string
  availableSlots: number
  occupiedVacancies: number
  eventType: string
  status: string
  startDate: Date
  endDate: Date
  organizer: string
}


export function EventList () {
  const { data } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get<Events>('/events')
      return response.data
    }
  })

  if (!data) return 

  return data.map(event => (
    <EventRow key={event.id} data={event} />
  ))
}