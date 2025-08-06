import { cn } from "../lib/utils";
import * as PrimitiveDialog from "@radix-ui/react-dialog";
import React, { type ComponentProps, type ElementRef, forwardRef } from "react";

export const Dialog = PrimitiveDialog.Dialog;
export const DialogTrigger = PrimitiveDialog.DialogTrigger;
export const DialogClose = PrimitiveDialog.DialogClose;
export const DialogTitle = PrimitiveDialog.DialogTitle;

export const DialogOverlay = forwardRef<
  ElementRef<typeof PrimitiveDialog.DialogOverlay>,
  ComponentProps<typeof PrimitiveDialog.DialogOverlay>
>(({ className, ...props }, ref) => (
  <PrimitiveDialog.DialogOverlay
    className={cn(
      "z-50 fixed inset-0 bg-black/75 backdrop-blur-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    ref={ref}
    {...props}
  />
));

DialogOverlay.displayName = PrimitiveDialog.DialogOverlay.displayName;

export const DialogContent = forwardRef<
  ElementRef<typeof PrimitiveDialog.DialogContent>,
  ComponentProps<typeof PrimitiveDialog.DialogContent>
>(({ className, ...props }, ref) => (
  <PrimitiveDialog.DialogPortal>
    <DialogOverlay />
    <PrimitiveDialog.DialogContent
      className={cn(
        "z-50 w-full max-w-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 rounded-xl p-8 border border-zinc-900",
        "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-[48%] data-[state=open]:slide-in-from-left-1/2",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:slide-out-to-left-1/2",
        className,
      )}
      ref={ref}
      {...props}
    />
  </PrimitiveDialog.DialogPortal>
));

DialogContent.displayName = PrimitiveDialog.DialogContent.displayName;
