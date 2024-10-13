"use client";

import { redirect } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";

import { api } from "@/lib/api";
import background from "@/assets/sun-tornado.svg";
import logoSarah from "@/assets/logo_sarah.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  password: z.string(),
});

export default function SignUp() {
  async function handleCreateAccount(data: FormData) {
    try {
      const { name, email, password, role } = userSchema.parse(
        Object.fromEntries(data),
      );

      await api.post("/users", {
        name,
        email,
        password,
        role,
      });
      toast.success("Conta criada com sucesso, va para tela de login.");
    } catch {
      toast.error("Ocorreu um erro tente novamente");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    redirect("/auth/sign-in");
  }
  return (
    <div className="w-full h-screen p-5 grid grid-cols-2 gap-10 auto-rows-auto place-items-center">
      <div className="w-full">
        <Image
          src={background}
          alt="Background Tornado"
          className="aspect-square rounded-2xl size-full"
        />
      </div>
      <form
        action=""
        className="px-20 w-full flex flex-col gap-y-16 items-center justify-center"
      >
        <div className="w-80 flex flex-col gap-y-2 items-center justify-center">
          <Image src={logoSarah} className="w-56" alt="SARAH" />
          <p className="text-center leading-relaxed text-xs">
            Rede SARAH de Hospitais de Reabilitação Associação das Pioneiras
            Sociais.
          </p>
        </div>
        <div className="w-full space-y-10">
          <span className="font-bold text-xl before:w-5 before:h-0.5 before:bg-orange-500 relative before:absolute before:bottom-0 block">
            Criar conta
          </span>

          <div className="space-y-5 w-full">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" placeholder="example@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role">Tipo de conta</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organizador">Organizador</SelectItem>
                    <SelectItem value="visualizador">Visualizador</SelectItem>
                    <SelectItem value="participante">Participante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" placeholder="****" type="password" />
              </div>
            </div>
          </div>
        </div>
        <Button className="w-44" type="submit">
          Criar conta
        </Button>

        <span className="text-zinc-400 text-xs">
          Já tem cadastro?{" "}
          <Link
            href="/auth/sign-in"
            className="font-bold text-zinc-100 hover:underline underline-offset-2"
          >
            Acessar conta
          </Link>
        </span>
      </form>
    </div>
  );
}
