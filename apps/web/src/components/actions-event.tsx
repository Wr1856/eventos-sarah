"use client";

import { useQueryClient } from "@tanstack/react-query";
import { isPast } from "date-fns";
import { Ban, Hand } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@next-acl/ui";
import type { EventRowProps } from "./event-row";
import { handleSubscribe, handleUnsubscribe } from "./actions";

type ActionsEventProps = EventRowProps;

export function ActionsEvent({ data }: ActionsEventProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  function subscribe() {
    try {
      handleSubscribe({ id: data.id, userId: session?.user.id ?? "" });
      toast.success("Inscricao realizada com sucesso!");
    } catch (error) {
      const message = (error as any)?.response?.data?.error ?? "Erro ao realizar inscrição";
      toast.error(message);
    }
  }

  function unsubscribe() {
    try {
      handleUnsubscribe({ id: data.id, userId: session?.user.id ?? "" });
      toast.success("Voce cancelou sua inscrição!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (error) {
      const message = (error as any)?.response?.data?.error ?? "Erro ao cancelar inscrição";
      toast.error(message);
    }
  }

  const isEventExpired = isPast(data.endDate);

  return data.participants.includes(session?.user.id ?? "") ? (
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
