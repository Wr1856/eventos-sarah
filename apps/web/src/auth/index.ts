import { defineAbilityFor } from "@next-acl/auth";

import { auth } from "@/auth-config";
import { api } from "@/lib/api";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user.id;
}

export async function getCurrentMembership(): Promise<{
  userId: string;
  role: "organizador" | "visualizador" | "participante";
}> {
  const userId = await getCurrentUser();
  const response = await api.get(`/user/${userId}`);

  return response.data;
}

export async function ability() {
  const membership = await getCurrentMembership();

  if (!membership) {
    return null;
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  });

  return ability;
}
