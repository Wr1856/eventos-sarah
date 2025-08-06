import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Title } from "@/components/ui/title";

export default function EditEvent() {
  return (
    <div className="w-full max-w-4xl px-20 mx-auto">
      <div className="flex items-center justify-between">
        <Title>Editar evento</Title>
        <div className="flex gap-3.5">
          <Button variant="secondary">Voltar</Button>
          <Button>Salvar</Button>
        </div>
      </div>

      <div className="pt-16">
        <form>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Nome</Label>
            <Input id="title" placeholder="Titulo do evento" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Descricao</Label>
            <Textarea id="name" placeholder="Descricao do evento" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Localizacao</Label>
            <Input id="location" placeholder="Localizacao do evento" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="availableSlots">Vagas</Label>
            <Input id="availableSlots" placeholder="Quantidade de vagas" />
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
        </form>
      </div>
    </div>
  );
}
