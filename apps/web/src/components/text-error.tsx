import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";
import type React from "react";

interface TextErrorProps extends React.ComponentProps<"div"> {
  isVisible: boolean;
}

export function TextError({
  className,
  children,
  isVisible,
  ...props
}: TextErrorProps) {
  if (!isVisible) return;

  return (
    <div
      className={cn(
        "text-xs text-zinc-500 font-medium flex items-center gap-1 mt-1.5",
        className,
      )}
      {...props}
    >
      <CircleX className="size-4 text-red-400" />
      {children}
    </div>
  );
}
