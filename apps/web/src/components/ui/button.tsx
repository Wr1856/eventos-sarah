import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rounded-3xl hover:rounded-xl flex items-center justify-center gap-2 font-semibold text-sm disabled:opacity-50 disabled:pointer-events-none transition-all",
  {
    variants: {
      variant: {
        primary: "bg-orange-500 text-orange-950",
        secondary:
          "bg-zinc-900 text-orange-500 hover:text-orange-50 border border-transparent hover:border-zinc-800/75",
        tertiary: "hover:bg-zinc-800 text-zinc-100",
        ghost:
          "bg-zinc-800 text-orange-400 border border-zinc-700/25 hover:text-zinc-100",
      },
      size: {
        default: "px-5 py-3",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ className, variant, size }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "button";
