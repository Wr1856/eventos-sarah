import NextAuth, { type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { setCookie } from "nookies";

import { api } from "./lib/api";

export type { Session, User } from "next-auth";

export const {
  auth,
  signIn,
  signOut,
  unstable_update: update,
  handlers,
} = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "E-mail",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const response = await api.post("/login", {
          email: credentials.email,
          password: credentials.password,
        });

        if (response.data.loggedIn) {
          const maxAge = 2 * 24 * 60 * 60;
          setCookie(null, "user", JSON.stringify(response.data), {
            maxAge,
            path: "/",
            httpOnly: true,
          });

          return {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
          };
        }

        throw new Error("Unauthorized.");
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      return false;
    },
    jwt({ token, user, session, trigger }) {
      if (user) {
        token.user = user;
      }

      function isSessionAvailable(session: unknown): session is Session {
        return !!session;
      }

      if (trigger === "update" && isSessionAvailable(session)) {
        token.user = session.user;
      }

      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user = token.user as typeof session.user;
        session.user.id = token.sub ?? "";
      }

      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnPublicAPIRoutes = nextUrl.pathname.startsWith("/api/auth");
      const isOnAPIRoutes = nextUrl.pathname.startsWith("/api");
      const publicPaths = ["/", "/event"];
      const isPublicPath = publicPaths.some(
        (path) =>
          nextUrl.pathname === path ||
          nextUrl.pathname.startsWith(`${path}/`),
      );
      const isOnPublicPages =
        nextUrl.pathname.startsWith("/auth") || isPublicPath;

      if (isOnPublicAPIRoutes) {
        return true;
      }

      if (isOnPublicPages) {
        if (isLoggedIn && nextUrl.pathname.startsWith("/auth")) {
          return Response.redirect(new URL("/", nextUrl));
        }

        return true;
      }

      if (isOnAPIRoutes && !isLoggedIn) {
        return Response.json({ message: "Unauthorized." }, { status: 401 });
      }

      if (!isOnPublicPages && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
});
