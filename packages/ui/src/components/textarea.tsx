import React from "react";

import { cn } from "../lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "bg-zinc-900 h-24 resize-none outline-none p-3 rounded-xl w-full font-medium text-sm placeholder-zinc-600 border border-transparent hover:border-zinc-800",
      className,
    )}
    ref={ref}
    {...props}
  />
));

Textarea.displayName = "Textarea";
