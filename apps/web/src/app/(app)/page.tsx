import { EventList } from "@/components/event-list";
import { Title } from "@/components/ui/title";
import { CreateEventDialog } from "./create-event";
import { ability } from "@/auth";

export const revalidate = 900;

export default async function Home() {
  const permissions = await ability();
  return (
    <div className="px-32 mt-9">
      <div className="flex items-center justify-between">
        <Title>Eventos</Title>
        {permissions?.can("create", "Event") && <CreateEventDialog />}
      </div>

      <EventList />
    </div>
  );
}
