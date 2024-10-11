'use client'

import { api } from '@/lib/api'
import type { AxiosError } from 'axios'
import { format } from 'date-fns'
import { Ellipsis } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface EventRowProps {
  data: {
    id: string
    title: string
    location: string
    startDate: Date
    availableSlots: number
    occupiedVacancies: number
    status: string
  }
}

export function EventRow({ data }: EventRowProps) {
  const { data: session } = useSession()

  async function handleSubscribe() {
    try {
      await api.patch(`/event/${data.id}/subscribe`, {
        userId: session?.user.id
      })
      toast.success('Inscrição confirmada com sucesso!')
    } catch (error: AxiosError) {
      toast.error(error.response.data.error)
    }
  }

  async function handleUnsubscribe() {
    try {
      await api.patch(`/event/${data.id}/unsubscribe`, {
        userId: session?.user.id
      })
      toast.info('Voce cancelou sua inscrição!')
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }
  const parseDate = format(data.startDate, "dd 'de' MMMM yyyy")
  return (
    <tr className="h-10 odd:bg-zinc-100 text-sm [&>*]:px-2 hover:bg-orange-100">
      <td>{data.title}</td>
      <td>{data.location}</td>
      <td>{parseDate}</td>
      <td>{data.availableSlots === data.occupiedVacancies ? 'Vagas esgotadas' : data.availableSlots - data.occupiedVacancies}</td>
      <td>
        <button
          onClick={handleSubscribe}
          disabled={data.availableSlots === data.occupiedVacancies || data.status === 'cancelado'}
          type="button"
          className="bg-orange-400 rounded p-2 font-medium hover:bg-orange-500 disabled:opacity-50 disabled:pointer-events-none mr-1"
        >
          Inscrever-se
        </button>
        <button
          onClick={handleUnsubscribe}
          disabled={data.availableSlots === data.occupiedVacancies || data.status === 'cancelado'}
          type="button"
          className="bg-orange-400 rounded p-2 font-medium hover:bg-orange-500 disabled:opacity-50 disabled:pointer-events-none"
        >
          Cancelar inscrição
        </button>
      </td>
      <td>
        <button type='button' className='flex items-center justify-center rounded size-8 bg-zinc-200 text-zinc-950 border border-zinc-300'>
          <Ellipsis className='size-4' />
        </button>
      </td>
    </tr>
  )
}