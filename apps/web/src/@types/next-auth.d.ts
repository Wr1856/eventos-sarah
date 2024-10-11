import type { DefaultSession, User as DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    name: string
    email: string
    role: string
  }

  export interface Session extends DefaultSession {
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user: User
  }
}