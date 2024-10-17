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

const appAbilities = z.union([
  eventSubject,
  participantsSubject,

  z.tuple([z.literal("manager"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilities>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User): AppAbility {
  const builder = new AbilityBuilder(createAppAbility);

  if (typeof permissions[user.role] === "function") {
    permissions[user.role](user, builder);
  } else {
    throw new Error(`Trying to use unknown role ${user.role}`);
  }

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  ability.can = ability.can.bind(ability);
  ability.cannot = ability.cannot.bind(ability);

  return ability;
}
