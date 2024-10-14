import React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "bg-zinc-900 outline-none p-3 rounded-xl w-full font-medium text-sm placeholder-zinc-600 border border-transparent hover:border-zinc-800",
      className,
    )}
    ref={ref}
    {...props}
  />
));

Input.displayName = "Input";
