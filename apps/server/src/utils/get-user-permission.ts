import { authUserSchema, defineAbilityFor, type Role } from "@next-acl/auth";

export function getUserPergmission(userId: string, role: Role) {
  const authUser = authUserSchema.parse({ id: userId, role });

  const ability = defineAbilityFor(authUser);

  return ability;
}
