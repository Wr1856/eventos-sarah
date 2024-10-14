import { cn } from "@/lib/utils";
import * as PrimitiveDialog from "@radix-ui/react-dialog";
import React, { type ComponentProps, type ElementRef, forwardRef } from "react";

export const Dialog = PrimitiveDialog.Dialog;
export const DialogTrigger = PrimitiveDialog.DialogTrigger;
export const DialogClose = PrimitiveDialog.DialogClose;

export const DialogOverlay = forwardRef<
  ElementRef<typeof PrimitiveDialog.DialogOverlay>,
  ComponentProps<typeof PrimitiveDialog.DialogOverlay>
>(({ className, ...props }, ref) => (
  <PrimitiveDialog.DialogOverlay
    className={cn("z-50 fixed inset-0 bg-black/75 backdrop-blur-lg", className)}
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
        "z-50 w-full max-w-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 rounded-xl p-4 border border-zinc-900",
        className,
      )}
      ref={ref}
      {...props}
    />
  </PrimitiveDialog.DialogPortal>
));

DialogContent.displayName = PrimitiveDialog.DialogContent.displayName;
