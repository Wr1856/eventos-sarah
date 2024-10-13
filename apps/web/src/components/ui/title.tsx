import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function Title({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-bold text-xl before:w-5 before:h-0.5 before:bg-orange-500 relative before:absolute before:bottom-0 block",
        className,
      )}
      {...props}
    />
  );
}
