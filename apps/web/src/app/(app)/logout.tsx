import { signOut } from "@/auth-config"

export function LogoutAction() {
  async function logout() {
    'use server'

    await signOut({ redirectTo: '/auth/sign-in' })
  }
  return (
    <form action={logout}>
      <button className="rounded bg-orange-500 font-medium w-14 h-10 text-orange-50" type="submit">Sair</button>
    </form>
  )
}