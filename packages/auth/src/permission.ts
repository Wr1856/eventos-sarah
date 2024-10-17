import type { AbilityBuilder } from "@casl/ability";
import type { Role } from "./roles";
import type { AppAbility } from "./abilitites";
import type { User } from "./models/user";

type UserPermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

export const permissions: Record<Role, UserPermissions> = {
  organizador(user, { can, cannot }) {
    can("manager", "all");
    cannot("delete", "Event");
    can("delete", "Event", { userId: { $eq: user.id } });
  },
  visualizador(user, { can, cannot }) {
    can("get", "Event");
    can("get", "Participants");
  },
  participante(user, { can, cannot }) {
    can("get", "Participants");
    can(["subscribe", "unsubscribe", "get"], "Event");
  },
};
