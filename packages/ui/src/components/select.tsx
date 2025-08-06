"use client";

import { cn } from "../lib/utils";
import * as PrimitiveSelect from "@radix-ui/react-select";
import { ChevronsLeftRight } from "lucide-react";
import * as React from "react";

export const Select = PrimitiveSelect.Select;
export const SelectValue = PrimitiveSelect.SelectValue;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof PrimitiveSelect.SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof PrimitiveSelect.SelectTrigger>
>(({ className, children, ...props }, ref) => (
  <PrimitiveSelect.Trigger
    ref={ref}
    className={cn(
      "bg-zinc-900 data-[placeholder]:text-zinc-600 flex items-center justify-between outline-none p-3 rounded-xl w-full font-medium text-sm border border-transparent hover:border-zinc-800",
      className,
    )}
    {...props}
  >
    {children}
    <PrimitiveSelect.Icon asChild>
      <ChevronsLeftRight className="size-4 rotate-90" />
    </PrimitiveSelect.Icon>
  </PrimitiveSelect.Trigger>
));

SelectTrigger.displayName = PrimitiveSelect.SelectTrigger.displayName;

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof PrimitiveSelect.SelectContent>,
  React.ComponentPropsWithoutRef<typeof PrimitiveSelect.SelectContent>
>(({ className, children, position = "popper", ...props }, ref) => (
  <PrimitiveSelect.SelectPortal>
    <PrimitiveSelect.SelectContent
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-fit overflow-hidden rounded-md [&>span]:line-clamp-1 whitespace-nowrap p-1 text-sm flex gap-2 items-center border border-zinc-800 bg-zinc-900 shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <PrimitiveSelect.SelectViewport className="space-y-1">
        {children}
      </PrimitiveSelect.SelectViewport>
    </PrimitiveSelect.SelectContent>
  </PrimitiveSelect.SelectPortal>
));

SelectContent.displayName = PrimitiveSelect.SelectContent.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof PrimitiveSelect.SelectItem>,
  React.ComponentPropsWithoutRef<typeof PrimitiveSelect.SelectItem>
>(({ className, children, ...props }, ref) => (
  <PrimitiveSelect.SelectItem
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded px-2 py-1 pr-8 text-sm outline-none data-[state=checked]:bg-orange-500 data-[highlighted]:bg-zinc-800 transition-colors",
      className,
    )}
    {...props}
  >
    <PrimitiveSelect.SelectItemText>{children}</PrimitiveSelect.SelectItemText>
  </PrimitiveSelect.SelectItem>
));

SelectItem.displayName = PrimitiveSelect.SelectItem.displayName;
