import z from "zod";

export const eventSchema = z.object({
  __typename: z.literal("Event").default("Event"),
  userId: z.string().cuid2(),
});
