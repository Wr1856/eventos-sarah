"use client";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  areIntervalsOverlapping,
  formatDistance,
  intervalToDuration,
} from "date-fns";
import { Clock4, User, Users2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Participant {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  location: string;
  availableSlots: number;
  occupiedVacancies: number;
  eventType: string;
  status: string;
  startDate: Date;
  endDate: Date;
  organizer: {
    id: string;
    name: string;
  };
  createdAt: Date;
}

export default function Event() {
  const { id } = useParams<{ id: string }>();
  const [timeUntilEventStart, setTimeUntilEventStart] = useState<string | null>(
    null,
  );

  const { data: participants } = useQuery<Participant[]>({
    queryKey: ["participants", id],
    queryFn: async () => {
      const response = await api.get(`/event/${id}/participants`);
      return response.data.participants;
    },
  });

  const { data: event } = useQuery<EventType>({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await api.get(`/event/${id}`);
      return response.data;
    },
  });

  function isEventExpired() {
    if (event) {
      const isOverllaping = areIntervalsOverlapping(
        { start: event.startDate, end: event.endDate },
        { start: event.endDate, end: new Date() },
      );
      return isOverllaping;
    }
  }

  const isOverllaping = isEventExpired();

  useEffect(() => {
    function formatDuration() {
      if (event && event.status === "ativo" && isOverllaping) {
        const duration = intervalToDuration({
          start: new Date(),
          end: event.startDate,
        });

        const days = String(duration.days).padStart(2, "0") || 0;
        const hours = String(duration.hours).padStart(2, "0") || 0;
        const minutes = String(duration.minutes).padStart(2, "0") || 0;
        const seconds = String(duration.seconds).padStart(2, "0") || 0;

        setTimeUntilEventStart(`${days}:${hours}:${minutes}:${seconds}`);
      }
    }
    const interval = setInterval(formatDuration, 1000);
    return () => clearInterval(interval);
  }, [event, isOverllaping]);

  if (!event) return;

  return (
    <div className="grid grid-cols-event gap-10 px-28 mt-11">
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8">
        <div className="flex items-start justify-between pb-6 border-b border-b-zinc-800 mb-3">
          <div className="space-y-3">
            <span
              className={cn(
                "inline-block px-3 py-2 rounded-full bg-emerald-400 text-emerald-800 font-bold text-xs uppercase",
                event.status === "cancelado" && "bg-red-950 text-red-500",
              )}
            >
              {!isOverllaping && event.status !== "cancelado"
                ? "Evento concluido"
                : event.status}
            </span>
            <Title className="text-3xl">{event.title}</Title>
            <span className="text-sm text-zinc-500 block">
              Criado{" "}
              {formatDistance(event.createdAt, new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>
          <div className="space-y-3 w-48 flex flex-col items-end">
            <Button
              disabled={!isOverllaping || event.status === "cancelado"}
              className="w-full"
            >
              Cancelar evento
            </Button>
            <div className="text-zinc-500 w-full flex items-center justify-between">
              <span className="inline-block">Inicia em:</span>
              <span className="font-bold text-zinc-100">
                {event.status === "cancelado" || !isOverllaping
                  ? "00:00:00:00"
                  : timeUntilEventStart}
              </span>
            </div>
          </div>
        </div>

        <p className="text-zinc-300 text-base leading-relaxed py-4">
          {event.description}
        </p>

        <span>Informacoes:</span>
        <ol className="list-disc pl-10 py-3">
          <li>
            <b>Local:</b> {event.location}
          </li>
          <li>
            <b>Total de vagas:</b> {event.availableSlots}
            {" - "}
            <span className="text-red-600">
              {" "}
              {event.occupiedVacancies} ocupadas
            </span>
          </li>
          <li>
            <b>Tipo de Evento:</b>{" "}
            <span className="capitalize">{event.eventType}</span>
          </li>
        </ol>

        <div className="flex flex-col gap-4 border-t border-t-zinc-800 pt-6">
          <span className="font-bold text-xs uppercase text-zinc-500">
            Criado por
          </span>
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-full bg-zinc-500 text-zinc-800">
              <User className="size-5" />
            </div>
            <span>{event.organizer.name}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8">
        <div className="flex items-center justify-between border-b border-b-zinc-800 pb-6">
          <div>
            <Title>Participantes</Title>
            <span className="text-xs text-zinc-400 mt-2">
              Atualizado em tempo real
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-zinc-400">
            <Users2 className="size-4" />
            {participants?.length}
          </div>
        </div>

        <div className="pt-6 space-y-6">
          {participants?.map((participant) => (
            <div key={participant.id} className="flex items-center gap-2">
              <div className="size-10 bg-zinc-500 text-zinc-800 rounded-full flex items-center justify-center">
                <User className="size-5" />
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="font-bold">{participant.name}</span>
                <span className="text-xs text-zinc-400">
                  {participant.email}
                </span>
              </div>

              <div className="ml-auto flex items-center justify-center gap-2 text-xs bg-zinc-800 rounded-full px-2 py-1 border border-zinc-700">
                <Clock4 className="size-4" />
                {formatDistance(participant.registrationDate, new Date(), {
                  addSuffix: true,
                })}
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full uppercase text-xs">
            Carregar mais
          </Button>
        </div>
      </div>
    </div>
  );
}
