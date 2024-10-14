"use client";

import { Title } from "@/components/ui/title";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { Clock4, Timer, User, Users2 } from "lucide-react";
import { useParams } from "next/navigation";

interface Participant {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
}

export default function Event() {
  const { id } = useParams<{ id: string }>();

  const { data: participants } = useQuery<Participant[]>({
    queryKey: ["participants", id],
    queryFn: async () => {
      const response = await api.get(`/event/${id}/participants`);
      return response.data.participants;
    },
  });

  return (
    <div className="grid grid-cols-event gap-10 px-28">
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8">
        <Title>Event tal</Title>
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
            36
          </div>
        </div>

        <div className="pt-6 space-y-6">
          {participants?.map((participant) => (
            <div key={participant.id} className="flex items-center gap-2">
              <div className="size-10 bg-zinc-500 text-zinc-800 rounded-full flex items-center justify-center">
                <User className="size-4" />
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
        </div>
      </div>
    </div>
  );
}
