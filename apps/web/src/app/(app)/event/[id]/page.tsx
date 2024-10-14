"use client";

import { Button } from "@/components/ui/button";
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
        <div className="flex items-start justify-between pb-6 border-b border-b-zinc-800 mb-3">
          <div className="space-y-3">
            <span className="inline-block px-3 py-2 rounded-full bg-emerald-400 text-emerald-800 font-bold text-xs uppercase">
              Ativo
            </span>
            <Title className="text-3xl">Yoga Class</Title>
            <span className="text-sm text-zinc-500 block">
              Criado ha 5 horas
            </span>
          </div>
          <div className="space-y-3">
            <Button>Cancelar evento</Button>
            <span className="text-zinc-500 inline-block">
              Encerra em: <b className="font-bold text-zinc-100">01:12:26:64</b>
            </span>
          </div>
        </div>

        <p className="py-6">
          Olá! Estamos em busca de um desenvolvedor talentoso para colaborar no
          desenvolvimento de uma landing page dedicada a promover os serviços do
          nosso Pet Shop. Somos uma empresa apaixonada por cuidar dos animais,
          oferecendo serviços de banho e tosa, consultas veterinárias, e uma
          loja completa com produtos de qualidade para pets. Sobre o projeto:
          Escopo: A landing page terá 10 seções, cobrindo desde a apresentação
          da empresa até os serviços oferecidos e uma área para agendamento
          online. Design: O design completo já está pronto e finalizado no
          Figma, garantindo uma base sólida para o desenvolvimento. Objetivo:
          Criar uma página rápida e responsiva que ajude a converter visitantes
          em clientes, destacando a confiança e carinho que temos pelos pets. O
          que estamos buscando: Um desenvolvedor competente e comprometido, com
          experiência em HTML, CSS, JavaScript e preferencialmente em React, que
          consiga transformar o design em uma landing page otimizada e
          funcional. Alguém que tenha um olhar crítico para detalhes e que possa
          colaborar para garantir a melhor performance e usabilidade. Estamos
          animados para trabalhar com alguém que compartilhe nossa paixão por
          criar experiências de qualidade!
        </p>
        <div className="flex flex-col gap-4 border-t border-t-zinc-800 pt-6">
          <span className="font-bold text-xs uppercase text-zinc-500">
            Criado por
          </span>
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-full bg-zinc-500 text-zinc-800">
              <User className="size-5" />
            </div>
            <span>John Doe</span>
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
        </div>
      </div>
    </div>
  );
}
