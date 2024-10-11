'use client'

import { api } from '@/lib/api'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover'
import { useQueryClient } from '@tanstack/react-query'
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
    organizer: {
      id: string
      name: string
    }
  }
}

export function EventRow({ data }: EventRowProps) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  async function handleSubscribe() {
    try {
      await api.patch(`/event/${data.id}/subscribe`, {
        userId: session?.user.id
      })
      toast.success('Inscrição confirmada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['events']})
    } catch (error: AxiosError) {
      toast.error(error.response.data.error || error.response.data.message)
    }
  }

  async function handleUnsubscribe() {
    try {
      await api.patch(`/event/${data.id}/unsubscribe`, {
        userId: session?.user.id
      })
      toast.success('Voce cancelou sua inscrição!')
      queryClient.invalidateQueries({ queryKey: ['events']})
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  async function handleCancelEvent() {
    try {
      await api.patch(`/event/${data.id}/cancel`, {
        userId: session?.user.id
      })
      toast.info('Voce cancelou o evento!')
      queryClient.invalidateQueries({ queryKey: ['events']})
    } catch (error) {
      toast.error('Voce nao pode cancelar um evento que nao e seu')
    }
  }

  async function handleDeleteEvent() {
    try {
      await api.delete(`/event/${data.id}/${session?.user.id}`)
      toast.info('Voce excluiu o evento!')
      queryClient.invalidateQueries({ queryKey: ['events']})
    } catch (error) {
      toast.error('Voce nao pode excluir um evento que nao foi voce que criou')
    }
  }

  const parseDate = format(data.startDate, "dd 'de' MMMM yyyy")
  return (
    <tr className="h-10 odd:bg-zinc-100 text-sm [&>*]:px-2 hover:bg-orange-100">
      <td>{data.title}</td>
      <td>{data.location}</td>
      <td>{parseDate}</td>
      <td>{
        data.status === 'cancelado' 
          ? (<span className='text-sm text-red-500 font-semibold'>Evento cancelado</span>)
          : data.availableSlots === data.occupiedVacancies 
            ? (<span className='text-sm text-red-500 font-semibold'>Vagas esgotadas</span>) 
            : data.availableSlots - data.occupiedVacancies}
      </td>
      <td>
        <button
          onClick={handleSubscribe}
          disabled={data.status === 'cancelado' || session?.user.id === data.organizer.id}
          type="button"
          className="bg-orange-400 rounded p-2 font-medium hover:bg-orange-500 disabled:opacity-50 disabled:pointer-events-none mr-1"
        >
          Inscrever-se
        </button>
        <button
          onClick={handleUnsubscribe}
          disabled={data.status === 'cancelado' || session?.user.id === data.organizer.id}
          type="button"
          className="bg-orange-400 rounded p-2 font-medium hover:bg-orange-500 disabled:opacity-50 disabled:pointer-events-none"
        >
          Cancelar inscrição
        </button>
      </td>
      <td>
        {session?.user.role === 'organizador' && (
          <Popover>
            <PopoverTrigger asChild>
              <button type='button' className='flex items-center justify-center rounded size-8 bg-zinc-200 text-zinc-950 border border-zinc-300'>
                <Ellipsis className='size-4' />
              </button>
            </PopoverTrigger>
            <PopoverPortal>
              
              <PopoverContent className='flex flex-col gap-2 bg-white border border-zinc-400 p-2 rounded-md'>
                <button onClick={handleCancelEvent} type='button' className="text-xs bg-red-200 text-red-950 rounded p-1 font-medium hover:bg-red-300 disabled:opacity-50 disabled:pointer-events-none">Cancelar evento</button>
                <button type='button' className="text-xs bg-zinc-200 text-zinc-950 rounded p-1 font-medium hover:bg-zinc-300 disabled:opacity-50 disabled:pointer-events-none">Editar evento</button>
                <button onClick={handleDeleteEvent} type='button' className="text-xs bg-zinc-200 text-zinc-950 rounded p-1 font-medium hover:bg-zinc-300 disabled:opacity-50 disabled:pointer-events-none">Excluir evento</button>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        )}
      </td>
    </tr>
  )
}