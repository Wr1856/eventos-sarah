'use client'

import { useSession } from "next-auth/react"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogOverlay,
	DialogPortal,
	DialogTrigger,
} from "@radix-ui/react-dialog";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  availableSlots: z.coerce.number(),
  eventType: z.string().min(1),
  status: z.string().default('ativo')
})

type EventProps = z.infer<typeof createEventSchema>

export function CreateEventDialog() {
  const { data: session } = useSession()
  const [selected, setSelected] = useState<DateRange>()
  const queryClient = useQueryClient()

  const { handleSubmit, register, formState: { errors }} = useForm<EventProps>({
    resolver: zodResolver(createEventSchema)
  })

  async function createEvent (data: EventProps) {
    const body = {
      ...data,
      startDate: selected?.from?.toISOString(),
      endDate: selected?.to?.toISOString(),
      organizerId: session?.user.id
    }
    try {
      await api.post('/events', body)
      toast.success('Evento criado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['events']})
    } catch (error) {
      toast.error('Um erro inesperado ocorreu, tente novamente')
    }
  }

  if (session?.user.role !== 'organizador') return

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="my-4 bg-transparent border border-orange-500 p-2 rounded-lg text-orange-700 font-semibold hover:bg-orange-500 hover:text-orange-100"
        >
          Cadastrar evento
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-4">
          <span className="font-semibold block p-2 text-orange-500">Cadastrar Evento</span>
          <form onSubmit={handleSubmit(createEvent)} className="flex flex-col gap-4 mb-4">
            <input
              className="p-2 rounded border border-zinc-400 bg-zinc-100"
              type="text"
              placeholder="Titulo"
              {...register('title')}
            />
            <span className="text-red-400 font-medium">{errors.title?.message}</span>
            <input
              className="p-2 rounded border border-zinc-400 bg-zinc-100"
              type="text"
              placeholder="Descrição"
              {...register('description')}
            />
            <span className="text-red-400 font-medium">{errors.description?.message}</span>
            <input
              className="p-2 rounded border border-zinc-400 bg-zinc-100"
              type="text"
              placeholder="Local"
              {...register('location')}
            />
            <span className="text-red-400 font-medium">{errors.location?.message}</span>
            <input
              className="p-2 rounded border border-zinc-400 bg-zinc-100"
              type="text"
              placeholder="Total de vagas"
              {...register('availableSlots')}
            />
            <span className="text-red-400 font-medium">{errors.availableSlots?.message}</span>
            <input
              className="p-2 rounded border border-zinc-400 bg-zinc-100"
              type="text"
              placeholder="Tipo de evento"
              {...register('eventType')}
            />
            <span className="text-red-400 font-medium">{errors.eventType?.message}</span>
            <span className="font-bold">Inicio e termino do evento</span>
            <DayPicker
              locale={ptBR}
              mode="range"
              selected={selected}
              onSelect={setSelected}
            />
          <div className="flex items-center gap-2">
            <DialogClose className="bg-zinc-200 text-zinc-950 p-2 rounded">
              Cancelar
            </DialogClose>
            <button
              type="submit"
              className="bg-orange-200 text-orange-950 p-2 rounded"
            >
              Cadastrar
            </button>
          </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}