"use client";

import { useQuery } from "@tanstack/react-query";
import { setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale";

setDefaultOptions({ locale: ptBR });

import { api } from "@/lib/api";
import { EventRow } from "./event-row";

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
  organizer: {
    id: string;
    name: string;
  };
}

export function EventList() {
  const { data } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get<Events>("/events");
      return response.data;
    },
  });

  if (!data) return;

  return (
    <div className="h-[60vh] space-y-4 mt-11 px-24 py-3 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-zinc-800 scrollbar-track-zinc-900 overflow-y-auto">
      {data.map((event) => (
        <EventRow key={event.id} data={event} />
      ))}
    </div>
  );
}
