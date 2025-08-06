"use client";

import * as PrimitiveDropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";

import { cn } from "../lib/utils";

export const DropdownMenu = PrimitiveDropdownMenu.Root;
export const DropdownMenuTrigger = PrimitiveDropdownMenu.Trigger;

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof PrimitiveDropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof PrimitiveDropdownMenu.Content>
>(({ className, ...props }, ref) => (
  <PrimitiveDropdownMenu.Portal>
    <PrimitiveDropdownMenu.Content
      className={cn("w-60 bg-zinc-900 p-2 rounded-2xl", className)}
      ref={ref}
      {...props}
    />
  </PrimitiveDropdownMenu.Portal>
));

DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof PrimitiveDropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof PrimitiveDropdownMenu.Item>
>(({ className, ...props }, ref) => (
  <PrimitiveDropdownMenu.Item
    className={cn(
      "p-1 text-sm font-medium rounded-lg outline-none hover:bg-zinc-800 flex items-center gap-x-1 px-2",
      className,
    )}
    ref={ref}
    {...props}
  />
));

DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof PrimitiveDropdownMenu.Label>,
  React.ComponentPropsWithoutRef<typeof PrimitiveDropdownMenu.Label>
>(({ className, ...props }, ref) => (
  <PrimitiveDropdownMenu.Label
    className={cn("px-2 text-zinc-500 text-sm font-medium mb-2", className)}
    ref={ref}
    {...props}
  />
));

DropdownMenuLabel.displayName = "DropdownMenuLabel";
