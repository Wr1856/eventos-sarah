"use client";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Hand, Pencil, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Link from "next/link";

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
            Organizador: <b className="text-zinc-100">{data.organizer.name}</b>
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
    </Link>
  );
}
