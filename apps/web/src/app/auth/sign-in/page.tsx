"use client";

import Link from "next/link";
import Image from "next/image";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import background from "@/assets/sun-tornado.svg";
import logoSarah from "@/assets/logo_sarah.svg";
import { Title } from "@/components/ui/title";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleLogin } from "./actions";
import { TextError } from "@/components/text-error";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email({ message: "Email invalido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve conter no minimo 6 caracters." }),
});

export type LoginProps = z.infer<typeof loginSchema>;

export default function SignIn() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginProps>({
    resolver: zodResolver(loginSchema),
  });

  const action: () => void = handleSubmit(async (data) => {
    try {
      await handleLogin(data);
    } catch {
      toast.error("Dados incorretos tente novamente.");
    }
  });

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
        action={action}
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
          <Title>Acessar conta</Title>

          <div className="space-y-5 w-full">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="example@example.com"
              />
              <TextError isVisible={!!errors.email?.message}>
                {errors.email?.message}
              </TextError>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                {...register("password")}
                placeholder="****"
                type="password"
              />
              <TextError isVisible={!!errors.password?.message}>
                {errors.password?.message}
              </TextError>
            </div>
          </div>
        </div>
        <Button className="w-44" type="submit">
          Acessar conta
        </Button>

        <span className="text-zinc-400 text-xs">
          Não tem cadastro?{" "}
          <Link
            href="/auth/sign-up"
            className="font-bold text-zinc-100 hover:underline underline-offset-2"
          >
            Criar conta
          </Link>
        </span>
      </form>
    </div>
  );
}
