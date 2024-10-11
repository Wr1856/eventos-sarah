import { signIn } from "@/auth-config"
import Link from "next/link"
import email from "next-auth/providers/email"
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export default function SignIn () {
  async function login (data: FormData) {
    'use server'

    const { email, password } = loginSchema.parse(Object.fromEntries(data))

    await signIn('credentials', { email, password, redirectTo: '/' })
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form action={login} method="POST" className="w-full max-w-xl flex flex-col bg-white rounded-lg shadow-xl overflow-hidden p-4 space-y-4">
        <h1 className="text-xl font-semibold text-center ">Entrar no sistema</h1>
        <input name="email" className="p-2 rounded border border-zinc-400 bg-zinc-100" type="text" placeholder="Email" />
        <input name="password" className="p-2 rounded border border-zinc-400 bg-zinc-100" type="password" placeholder="Senha" />
        <button className="rounded bg-orange-500 font-medium h-10 text-orange-50" type="submit">
          Entrar
        </button>

        <p className="text-center">
          Se voce nao tem um cadastro considere criar uma <Link href="/auth/sign-up" className="hover:underline underline-offset-2 text-blue-500">clicando aqui.</Link>
        </p>
      </form>
    </div>
  )
}