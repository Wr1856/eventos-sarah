"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { connectToEventNotification } from "@/lib/notify";

interface EventsNotifierProps {
  eventIds: string[];
}

export function EventsNotifier({ eventIds }: EventsNotifierProps) {
  const router = useRouter();

  useEffect(() => {
    const disconnects = eventIds.map((id) =>
      connectToEventNotification(id, () => {
        router.refresh();
      }),
    );

    return () => {
      disconnects.forEach((disconnect) => disconnect());
    };
  }, [eventIds, router]);

  return null;
}

