"use client";

import { format, isPast } from "date-fns";
import { Pencil, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePermission } from "@/auth/use-auth";
import { ActionsEvent } from "./actions-event";

export interface EventRowProps {
  data: {
    id: string;
    title: string;
    location: string;
    startDate: Date;
    endDate: Date;
    availableSlots: number;
    occupiedVacancies: number;
    status: string;
    description: string;
    participants: string[];
    organizer: {
      id: string;
      name: string;
    };
  };
}

export function EventRow({ data }: EventRowProps) {
  const permission = usePermission();

  // async function handleDeleteEvent() {
  //   try {
  //     await api.delete(`/event/${data.id}/${session?.user.id}`);
  //     toast.info("Voce excluiu o evento!");
  //     queryClient.invalidateQueries({ queryKey: ["events"] });
  //   } catch {
  //     toast.error("Voce nao pode excluir um evento que nao foi voce que criou");
  //   }
  // }

  const parseDate = format(data.startDate, "dd 'de' MMMM yyyy");

  return (
    <Link
      href={`/event/${data.id}`}
      className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex gap-3 items-center justify-between ring-2 ring-transparent ring-offset-2 ring-offset-zinc-950 hover:ring-orange-500"
    >
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold">{data.title}</span>
          <span
            className={cn(
              "font-semibold text-xs rounded-full bg-orange-500 px-2 py-0.5",
              isPast(data.endDate) && "bg-emerald-500 text-emerald-900",
              (data.status === "cancelado" ||
                data.availableSlots === data.occupiedVacancies) &&
                "bg-red-400 text-red-50",
            )}
          >
            {data.status === "cancelado"
              ? "Evento cancelado"
              : isPast(data.endDate)
                ? "Evento Concluido"
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
        <div className="flex flex-col items-end text-sm gap-y-1">
          <span className="text-zinc-500">
            Local do evento: <b className="text-zinc-100">{data.location}</b>
          </span>
          <span className="text-zinc-500">
            Organizador: <b className="text-zinc-100">{data.organizer.name}</b>
          </span>
        </div>

        {permission?.can("manage", "Event") && (
          <>
            <div className="w-px h-10 bg-zinc-800 shrink-0" />
            <Button variant="tertiary" size="icon" type="button">
              <Trash className="size-4 shrink-0" />
            </Button>

            <Button variant="tertiary" size="icon" type="button">
              <Pencil className="size-4 shrink-0" />
            </Button>
          </>
        )}
        {permission?.can("subscribe", "Event") && <ActionsEvent data={data} />}
      </div>
    </Link>
  );
}
