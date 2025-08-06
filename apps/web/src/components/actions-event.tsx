"use client";

import { useQueryClient } from "@tanstack/react-query";
import { isPast } from "date-fns";
import { Ban, Hand } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { Button } from "@next-acl/ui";
import type { EventRowProps } from "./event-row";
import { revalidatePath, revalidateTag } from "next/cache";
import { handleSubscribe, handleUnsubscribe } from "./actions";

type ActionsEventProps = EventRowProps;

export function ActionsEvent({ data }: ActionsEventProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  function subscribe() {
    try {
      handleSubscribe({ id: data.id, userId: session?.user.id });
      toast.success("Inscricao realizada com sucesso!");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  function unsubscribe() {
    try {
      handleUnsubscribe({ id: data.id, userId: session?.user.id });
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
      onClick={unsubscribe}
      disabled={data.status === "cancelado" || isPast(data.endDate)}
    >
      <Ban className="size-4" />
      Cancelar participacao
    </Button>
  ) : (
    <Button
      variant="success"
      onClick={subscribe}
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
