import z from "zod";

export const eventSchema = z.object({
  userId: z.string().cuid2(),
});
