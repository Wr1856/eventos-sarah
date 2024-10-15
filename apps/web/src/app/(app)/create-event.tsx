"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus } from "lucide-react";
import { format } from "date-fns";
import "react-day-picker/style.css";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { TextError } from "@/components/text-error";

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  availableSlots: z.coerce.number(),
  eventType: z.string().min(1),
  status: z.string().default("ativo"),
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

type EventProps = z.infer<typeof createEventSchema>;

export function CreateEventDialog() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<EventProps>({
    resolver: zodResolver(createEventSchema),
  });

  async function createEvent(data: EventProps) {
    const body = {
      ...data,
      startDate: data.date.from.toISOString(),
      endDate: data.date.to.toISOString(),
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
      <DialogContent>
        <DialogTitle asChild>
          <Title className="mb-11">Informações do Evento</Title>
        </DialogTitle>
        <form
          onSubmit={handleSubmit(createEvent)}
          className="w-full grid grid-cols-2 gap-4"
        >
          <div className="w-full flex flex-col gap-1.5">
            <Label>Título do evento</Label>
            <Input type="text" placeholder="Titulo" {...register("title")} />
            <TextError isVisible={!!errors.title?.message}>
              {errors.title?.message}
            </TextError>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Informações extras</Label>
            <Textarea placeholder="Descrição" {...register("description")} />
            <TextError isVisible={!!errors.description?.message}>
              {errors.description?.message}
            </TextError>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Local do evento</Label>
            <Input type="text" placeholder="Local" {...register("location")} />
            <TextError isVisible={!!errors.location?.message}>
              {errors.location?.message}
            </TextError>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Quantodade de vagas</Label>
            <Input
              type="text"
              placeholder="obs: '0' para vagas ilimitadas"
              {...register("availableSlots")}
            />
            <TextError isVisible={!!errors.availableSlots?.message}>
              {errors.availableSlots?.message}
            </TextError>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Categoria</Label>
            <Controller
              {...register("eventType")}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione tipo o evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="híbrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <TextError isVisible={!!errors.eventType?.message}>
              {errors.eventType?.message}
            </TextError>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Inicio e termino do evento</Label>
            <Controller
              {...register("date")}
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-3 bg-zinc-900 outline-none p-3 rounded-xl w-full font-medium text-sm text-zinc-600 border border-transparent hover:border-zinc-800",
                        value && "text-zinc-100",
                      )}
                    >
                      <Calendar className="size-4" />
                      <span>
                        {value
                          ? format(value.from, "d' de 'LLL")
                              .concat(" até ")
                              .concat(format(value.to, "d' de 'LLL"))
                          : "Quando?"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverPortal>
                    <PopoverContent
                      side="right"
                      align="start"
                      className="z-50 max-w-fit bg-zinc-900 rounded-xl p-4 border border-zinc-800"
                    >
                      <PopoverArrow asChild>
                        <div className="size-1 border-4 border-transparent border-t-zinc-800" />
                      </PopoverArrow>
                      <DayPicker
                        locale={ptBR}
                        mode="range"
                        selected={value}
                        onSelect={onChange}
                      />
                    </PopoverContent>
                  </PopoverPortal>
                </Popover>
              )}
            />
            <TextError isVisible={!!errors.date?.message}>
              {errors.date?.message}
            </TextError>
          </div>

          <div className="col-span-2 flex flex-1 items-center justify-end gap-2">
            <DialogClose asChild>
              <Button variant="secondary" type="submit">
                Voltar
              </Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
