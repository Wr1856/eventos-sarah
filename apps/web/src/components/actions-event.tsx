"use client";

import { useQueryClient } from "@tanstack/react-query";
import { isPast } from "date-fns";
import { Ban, Hand } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { EventRowProps } from "./event-row";
import { revalidatePath, revalidateTag } from "next/cache";

type ActionsEventProps = EventRowProps;

export function ActionsEvent({ data }: ActionsEventProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  async function handleSubscribe() {
    try {
      await api.patch(`/event/${data.id}/subscribe`, {
        userId: session?.user.id,
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
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

  const isEventExpired = isPast(data.endDate);

  return data.participants.includes(session?.user.id) ? (
    <Button
      variant="danger"
      onClick={handleUnsubscribe}
      disabled={data.status === "cancelado" || isPast(data.endDate)}
    >
      <Ban className="size-4" />
      Cancelar participacao
    </Button>
  ) : (
    <Button
      variant="success"
      onClick={handleSubscribe}
      disabled={
        data.status === "cancelado" ||
        isEventExpired ||
        !(data.availableSlots - data.occupiedVacancies)
      }
    >
      <Hand className="size-4" />
      Participar do evento
    </Button>
  );
}
