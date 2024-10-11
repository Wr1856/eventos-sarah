import NextAuth, { type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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

				console.log(response.data)

				if (response.data.loggedIn) {
					console.log(response.data);

					return {
						id: response.data.id,
						name:  response.data.name,
						email:  response.data.email,
						role:  response.data.role
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
		session({ session, ...params }) {
			if ("token" in params && session.user) {
				session.user = params.token.user;
				session.user.id = params.token.sub;
			}

			return session;
		},
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;

			const isOnPublicAPIRoutes = nextUrl.pathname.startsWith("/api/auth");
			const isOnAPIRoutes = nextUrl.pathname.startsWith("/api");
			const isOnPublicPages = nextUrl.pathname.startsWith("/auth");
			const isOnPrivatePages = !isOnPublicPages;

			if (isOnPublicAPIRoutes) {
				return true;
			}

			if (isOnPublicPages && isLoggedIn) {
				return Response.redirect(new URL("/", nextUrl));
			}

			if (isOnAPIRoutes && !isLoggedIn) {
				return Response.json({ message: "Unauthorized." }, { status: 401 });
			}

			if (isOnPrivatePages && !isLoggedIn) {
				return false;
			}

			return true;
		},
	},
});