"use client";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import * as Separator from "@radix-ui/react-separator";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { format } from "date-fns";
import { Edit, Ellipsis, Hand, Pencil, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface EventRowProps {
  data: {
    id: string;
    title: string;
    location: string;
    startDate: Date;
    availableSlots: number;
    occupiedVacancies: number;
    status: string;
    description: string;
    organizer: {
      id: string;
      name: string;
    };
  };
}

export function EventRow({ data }: EventRowProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  async function handleSubscribe() {
    try {
      await api.patch(`/event/${data.id}/subscribe`, {
        userId: session?.user.id,
      });
      toast.success("Inscrição confirmada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (error) {
      toast.error(error.response.data.error || error.response.data.message);
    }
  }

  async function handleUnsubscribe() {
    try {
      await api.patch(`/event/${data.id}/unsubscribe`, {
        userId: session?.user.id,
      });
      toast.success("Voce cancelou sua inscrição!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  async function handleCancelEvent() {
    try {
      await api.patch(`/event/${data.id}/cancel`, {
        userId: session?.user.id,
      });
      toast.info("Voce cancelou o evento!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch {
      toast.error("Voce nao pode cancelar um evento que nao e seu");
    }
  }

  async function handleDeleteEvent() {
    try {
      await api.delete(`/event/${data.id}/${session?.user.id}`);
      toast.info("Voce excluiu o evento!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch {
      toast.error("Voce nao pode excluir um evento que nao foi voce que criou");
    }
  }

  const parseDate = format(data.startDate, "dd 'de' MMMM yyyy");
  return (
    <>
      {/* <tr className="h-10 odd:bg-zinc-100 text-sm [&>*]:px-2 hover:bg-orange-100">
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
    </tr> */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3 flex gap-3 items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold">{data.title}</span>
            <span
              className={cn(
                "font-semibold text-xs rounded-full bg-orange-500 px-2 py-0.5",
                (data.status === "cancelado" ||
                  data.availableSlots === data.occupiedVacancies) &&
                  "bg-red-400",
              )}
            >
              {data.status === "cancelado"
                ? "Evento cancelado"
                : data.availableSlots === data.occupiedVacancies
                  ? "Vagas esgotadas"
                  : `Vagas disponiveis ${data.availableSlots - data.occupiedVacancies}`}
            </span>
          </div>
          <div>
            <p className="text-sm text-zinc-400">{data.description}</p>
            <span className="text-sm italic text-orange-400">
              Data do evento: {parseDate}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-sm gap-y-1">
            <span className="text-zinc-500">
              Local do evento: <b className="text-zinc-100">{data.location}</b>
            </span>
            <span className="text-zinc-500">
              Organizador:{" "}
              <b className="text-zinc-100">{data.organizer.name}</b>
            </span>
          </div>

          <div className="w-px h-10 bg-zinc-800 shrink-0" />

          <Button variant="tertiary" size="icon" type="button">
            <Trash className="size-4 shrink-0" />
          </Button>

          <Button variant="tertiary" size="icon" type="button">
            <Pencil className="size-4 shrink-0" />
          </Button>
          <Button className="bg-emerald-500 text-emerald-950">
            <Hand className="size-4" />
            Participar do evento
          </Button>
        </div>
      </div>
    </>
  );
}
