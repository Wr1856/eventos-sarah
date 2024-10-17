import z from "zod";
import { eventSubject } from "./subjects/event";
import { participantsSubject } from "./subjects/participants";
import {
  type MongoAbility,
  type CreateAbility,
  AbilityBuilder,
  createMongoAbility,
} from "@casl/ability";
import { permissions } from "./permission";
import type { User } from "./models/user";

export * from "./models/event";
export * from "./models/user";
export * from "./roles";

const appAbilitiesSchema = z.union([
  eventSubject,
  participantsSubject,

  z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility);

  if (typeof permissions[user.role] !== "function") {
    throw new Error(`Permissions for role ${user.role} not found.`);
  }

  permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  ability.can = ability.can.bind(ability);
  ability.cannot = ability.cannot.bind(ability);

  return ability;
}
