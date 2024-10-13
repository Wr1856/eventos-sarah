import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "px-5 py-3 rounded-3xl hover:rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all",
  {
    variants: {
      variant: {
        primary: "bg-orange-500 text-orange-950",
        secondary: "bg-zinc-900 text-orange-500 hover:text-orange-50",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ className, variant }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "button";
