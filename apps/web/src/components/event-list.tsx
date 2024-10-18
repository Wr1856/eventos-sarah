"use client";

import { setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale";

setDefaultOptions({ locale: ptBR });

import { api } from "@/lib/api";
import { EventRow } from "./event-row";
import { unstable_cache } from "next/cache";
import { useQuery } from "@tanstack/react-query";

export type Events = Event[];

export interface Event {
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
  participants: string[];
  organizer: {
    id: string;
    name: string;
  };
}

export function EventList() {
  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get<Events>("/events");
      return response.data;
    },
  });

  if (!events) return;

  return (
    <div className="h-[60vh] space-y-4 mt-11 px-24 py-3 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-zinc-800 scrollbar-track-zinc-900 overflow-y-auto">
      {events.map((event) => (
        <EventRow key={event.id} data={event} />
      ))}
    </div>
  );
}
