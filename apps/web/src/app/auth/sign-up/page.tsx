'use client'

import { api } from "@/lib/api"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  password: z.string()
})

export default function SignUp () {
  async function handleCreateAccount (data: FormData) {
    try {
      const { name, email, password, role } = userSchema.parse(Object.fromEntries(data))

      await api.post('/users', {
        name,
        email,
        password, 
        role
      })
      toast.success('Conta criada com sucesso, va para tela de login.')
    } catch (error) {
      toast.error('error.response.data.message')
      return
      
    } 
    await new Promise(resolve => setTimeout(resolve, 3000))
    redirect('/auth/sign-in')
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form action={handleCreateAccount} method="POST" className="w-full max-w-xl flex flex-col bg-white rounded-lg shadow-xl overflow-hidden p-4 space-y-4">
        <h1 className="text-xl font-semibold text-center">Criar uma conta</h1>
        <input name="name" className="p-2 rounded border border-zinc-400 bg-zinc-100" type="text" placeholder="Nome" />
        <select name="role" className="p-2 rounded border border-zinc-400 bg-zinc-100">
          <option disabled>Selecione tipo de conta</option>
          <option value='participante'>Participante</option>
          <option value='organizador'>Organizador</option>
          <option value='visualizador'>Visualizador</option>
        </select>
        <input name="email" className="p-2 rounded border border-zinc-400 bg-zinc-100" type="text" placeholder="Email" />
        <input name="password" className="p-2 rounded border border-zinc-400 bg-zinc-100" type="password" placeholder="Senha" />
        <button className="rounded bg-orange-500 font-medium h-10 text-orange-50" type="submit">
          Entrar
        </button>
      </form>
    </div>
  )
}