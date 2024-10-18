"use server";

import { signIn } from "@/auth-config";
import type { LoginProps } from "./page";

export async function handleLogin({ email, password }: LoginProps) {
  await signIn("credentials", { email, password, redirectTo: "/" });
}
