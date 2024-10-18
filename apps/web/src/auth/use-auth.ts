"use client";

import { defineAbilityFor, type AppAbility } from "@next-acl/auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function usePermission() {
  const session = useSession();
  const [ability, setAbility] = useState<AppAbility | undefined>();

  useEffect(() => {
    const user = session.data?.user;

    if (user?.id && user?.role) {
      const permission = defineAbilityFor({
        id: user.id,
        role: user.role,
      });

      setAbility(permission);
    }
  }, [session]);

  return ability;
}
