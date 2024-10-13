"use client";

import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Title } from "@/components/ui/title";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  availableSlots: z.coerce.number(),
  eventType: z.string().min(1),
  status: z.string().default("ativo"),
});

type EventProps = z.infer<typeof createEventSchema>;

export function CreateEventDialog() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState<DateRange>();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EventProps>({
    resolver: zodResolver(createEventSchema),
  });

  async function createEvent(data: EventProps) {
    const body = {
      ...data,
      startDate: selected?.from?.toISOString(),
      endDate: selected?.to?.toISOString(),
      organizerId: session?.user.id,
    };
    try {
      await api.post("/events", body);
      toast.success("Evento criado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (error) {
      toast.error("Um erro inesperado ocorreu, tente novamente");
    }
  }

  if (!session?.user) {
    return <span>Carregando...</span>;
  }

  if (session?.user.role !== "organizador") return;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="size-4" />
          Cadastrar evento
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/75 backdrop-blur-lg" />
        <DialogContent className="w-full max-w-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 rounded-xl p-4 border border-zinc-900">
          <Title className="mb-11">Informações do Evento</Title>
          <form
            onSubmit={handleSubmit(createEvent)}
            className="flex flex-col gap-4 mb-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label>Título do evento</Label>
              <Input type="text" placeholder="Titulo" {...register("title")} />
              <span className="text-red-400 font-medium">
                {errors.title?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Informações extras</Label>
              <Input
                placeholder="Descrição"
                multiline
                {...register("description")}
              />
              <span className="text-red-400 font-medium">
                {errors.description?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Local do evento</Label>
              <Input
                type="text"
                placeholder="Local"
                {...register("location")}
              />
              <span className="text-red-400 font-medium">
                {errors.location?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Quantodade de vagas</Label>
              <Input
                type="text"
                placeholder="Total de vagas"
                {...register("availableSlots")}
              />
              <span className="text-red-400 font-medium">
                {errors.availableSlots?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Categoria</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione tipo o evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <span className="text-red-400 font-medium">
              {errors.eventType?.message}
            </span>
            <span className="font-bold">Inicio e termino do evento</span>
            {/*<DayPicker
              locale={ptBR}
              mode="range"
              selected={selected}
              onSelect={setSelected}
            />*/}
            <div className="flex flex-1 items-center justify-end gap-2">
              <DialogClose>
                <Button variant="secondary" type="submit">
                  Voltar
                </Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
