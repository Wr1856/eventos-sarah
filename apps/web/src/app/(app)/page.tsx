import { EventList } from "@/components/event-list";
import { Title } from "@/components/ui/title";
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
    </div>
  );
}
