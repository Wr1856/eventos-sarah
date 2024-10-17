"use client";

import { useRouter } from "next/navigation";
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
import { Title } from "@/components/ui/title";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextError } from "@/components/text-error";

const userSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  role: z.string(),
  password: z.string().min(6),
});

type CreateUser = z.infer<typeof userSchema>;

export default function SignUp() {
  const route = useRouter();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateUser>({
    resolver: zodResolver(userSchema),
  });
  async function handleCreateAccount(data: CreateUser) {
    try {
      const { name, email, password, role } = data;

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
    route.push("/auth/sign-in");
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
        onSubmit={handleSubmit(handleCreateAccount)}
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
          <Title>Criar conta</Title>

          <div className="space-y-5 w-full">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              <TextError isVisible={!!errors.name?.message}>
                {errors.name?.message}
              </TextError>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                placeholder="example@example.com"
                {...register("email")}
              />
              <TextError isVisible={!!errors.email?.message}>
                {errors.email?.message}
              </TextError>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role">Tipo de conta</Label>
                <Controller
                  {...register("role")}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de conta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="organizador">Organizador</SelectItem>
                        <SelectItem value="visualizador">
                          Visualizador
                        </SelectItem>
                        <SelectItem value="participante">
                          Participante
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <TextError isVisible={!!errors.role?.message}>
                  {errors.role?.message}
                </TextError>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  placeholder="****"
                  type="password"
                  {...register("password")}
                />
                <TextError isVisible={!!errors.password?.message}>
                  {errors.password?.message}
                </TextError>
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
