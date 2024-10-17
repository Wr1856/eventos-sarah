import z from "zod";

export const participantsTypeName = z.literal("Participants");

export const participantsSubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("get"),
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
  ]),
  participantsTypeName,
]);

export type ParticipantsTypeName = z.infer<typeof participantsTypeName>;
export type ParticipantsSubject = z.infer<typeof participantsSubject>;
