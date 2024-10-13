import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  multiline?: boolean;
}

export function Input({ className, multiline = false, ...props }: InputProps) {
  return multiline ? (
    <textarea
      className={cn(
        "bg-zinc-900 h-24 resize-none outline-none p-3 rounded-xl w-full font-medium text-sm placeholder-zinc-600 border border-transparent hover:border-zinc-800",
        className,
      )}
      name={props.name}
      placeholder={props.placeholder}
    />
  ) : (
    <input
      className={cn(
        "bg-zinc-900 outline-none p-3 rounded-xl w-full font-medium text-sm placeholder-zinc-600 border border-transparent hover:border-zinc-800",
        className,
      )}
      {...props}
    />
  );
}
