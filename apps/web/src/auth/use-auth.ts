"use client";

import { useSession } from "next-auth/react";
import { defineAbilityFor, authUserSchema } from "@next-acl/auth";

export function usePermission() {
  const session = useSession();

  const authUser = authUserSchema.parse(session.data?.user);

  const ability = defineAbilityFor(authUser);

  return ability;
}
