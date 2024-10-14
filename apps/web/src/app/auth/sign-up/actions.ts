"use server";

import { redirect } from "next/navigation";

export async function handleCreateAccount() {
  redirect("/auth/sign-in");
}
