import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "bg-zinc-900 outline-none p-3 rounded-xl w-full font-medium text-sm placeholder-zinc-600 border border-transparent hover:border-zinc-800",
        className,
      )}
      {...props}
    />
  );
}
