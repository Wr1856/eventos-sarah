import z from "zod";
import { eventSchema } from "../models/event";

export const eventTypeName = z.literal("Event");

export const eventSubject = z.tuple([
  z.union([
    z.literal("manager"),
    z.literal("get"),
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
    z.literal("subscribe"),
    z.literal("unsubscribe"),
  ]),
  z.union([eventTypeName, eventSchema]),
]);

export type EventTypeName = z.infer<typeof eventTypeName>;
export type EventSubject = z.infer<typeof eventSubject>;
