import { EventList } from "@/components/event-list";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { Plus } from "lucide-react";

export const revalidate = 900;

export default function Home() {
  return (
    <div className="px-32">
      <div className="flex items-center justify-between">
        <Title>Eventos</Title>
        <Button variant="secondary">
          <Plus className="size-4" />
          Cadastrar evento
        </Button>
      </div>

      <EventList />
    </div>
  );
}
