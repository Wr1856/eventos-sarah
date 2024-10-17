import type { AbilityBuilder } from "@casl/ability";

import type { Role } from "./roles";
import type { AppAbility } from ".";
import type { User } from "./models/user";

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

export const permissions: Record<Role, PermissionsByRole> = {
  organizador(user, { can, cannot }) {
    can("manage", "all");
    cannot(["delete", "update"], "Event");
    can(["delete", "update"], "Event", { userId: { $eq: user.id } });
  },
  visualizador(user, { can, cannot }) {
    can("get", "Event");
    can("get", "Participants");
  },
  participante(user, { can, cannot }) {
    can("get", "Participants");
    can("get", "Event");
    can(["subscribe", "unsubscribe"], "Event");
  },
};
