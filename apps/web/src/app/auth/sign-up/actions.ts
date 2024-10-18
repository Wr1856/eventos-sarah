"use server";

import { api } from "@/lib/api";
import type { CreateUser } from "./page";

export async function createUser({ name, email, password, role }: CreateUser) {
  await api.post("/users", {
    name,
    email,
    password,
    role,
  });
}
