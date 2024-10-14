import { EventList } from "@/components/event-list";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { LogOut, LucideHome } from "lucide-react";
import { CreateEventDialog } from "./create-event";

export const revalidate = 900;

export default function Home() {
  return (
    <div className="px-32 mt-9">
      <div className="flex items-center justify-between">
        <Title>Eventos</Title>
        <CreateEventDialog />
      </div>

      <EventList />
      <div className="w-fit fixed left-1/2 -translate-x-1/2 bottom-8 rounded-full p-2 border border-zinc-900 flex items-center justify-center">
        <Button
          size="icon"
          variant="tertiary"
          className="hover:rounded-[inherit]"
        >
          <LucideHome className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="tertiary"
          className="hover:rounded-[inherit]"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </div>
  );
}
