import { cn } from "@/lib/utils";
import type React from "react";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("font-semibold text-sm text-zinc-100", className)}
      {...props}
    />
  );
}
