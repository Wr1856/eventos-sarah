import { z } from "zod";

export const authUserSchema = z.object({
  id: z.string().cuid2(),
  role: z.enum(["organizador", "visualizador", "participante"]),
});

export type User = z.infer<typeof authUserSchema>;
