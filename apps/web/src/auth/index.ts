import { defineAbilityFor, type AppAbility } from "@next-acl/auth";

import { auth } from "@/auth-config";
import { api } from "@/lib/api";

export async function getCurrentUser(): Promise<string | null> {
  const session = await auth();
  const userId = session?.user.id;
  return userId ?? null;
}

export async function getCurrentMembership(): Promise<
  | {
      userId: string;
      role: "organizador" | "visualizador" | "participante";
    }
  | null
> {
  const userId = await getCurrentUser();

  if (!userId) {
    return null;
  }

  const response = await api.get(`/user/${userId}`);

  return response.data;
}

export async function ability(): Promise<AppAbility | null> {
  const membership = await getCurrentMembership();

  if (!membership) {
    return null;
  }

  return defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  });
}
