import z from "zod";

export const participantsTypeName = z.literal("Participants");

export const participantsSubject = z.tuple([
  z.literal("get"),
  participantsTypeName,
]);

export type ParticipantsTypeName = z.infer<typeof participantsTypeName>;
export type ParticipantsSubject = z.infer<typeof participantsSubject>;
