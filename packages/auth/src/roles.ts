import { z } from "zod";

export const roleSchema = z.union([
  z.literal("organizador"),
  z.literal("visualizador"),
  z.literal("participante"),
]);

export type Role = z.infer<typeof roleSchema>;
