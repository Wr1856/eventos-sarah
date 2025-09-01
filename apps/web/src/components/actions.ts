"use server";

import { api } from "@/lib/api";
import { revalidateTag } from "next/cache";

export async function handleSubscribe({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  if (!userId) {
    throw new Error("Unauthorized");
  }
  await api.patch(`/event/${id}/subscribe`, {
    userId,
  });
  revalidateTag("events");
}

export async function handleUnsubscribe({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  if (!userId) {
    throw new Error("Unauthorized");
  }
  await api.patch(`/event/${id}/unsubscribe`, {
    userId,
  });
  revalidateTag("events");
}
