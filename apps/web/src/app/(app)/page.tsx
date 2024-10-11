import { EventList } from "@/components/event-list";

export const revalidate = 900

export default function Home() {
  return (
    <div className="rounded-lg bg-white border border-zinc-400 p-4 ">
      <h3 className="font-medium text-lg mb-4">Lista de eventos</h3>

      <table className="w-full">
        <thead className="bg-zinc-200 h-14">
          <tr className="text-left [&>*]:pl-4">
            <th>Titulo</th>
            <th>Local</th>
            <th>Inicio do evento</th>
            <th>Vagas disponíveis</th>
            <th>Inscrição</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          <EventList />
        </tbody>
      </table>
    </div>
  );
}
