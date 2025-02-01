'use client'

import { Dialog as DialogPrimitive } from 'radix-ui'
// import { IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = ({ className, ...props }: DialogPrimitive.DialogOverlayProps) => (
  <DialogPrimitive.Overlay
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50',
      className,
    )}
    {...props}
  />
)
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = ({ className, children, ...props }: DialogPrimitive.DialogContentProps) => (
  <DialogPortal>
    <DialogOverlay>
      <DialogPrimitive.Content
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 grid max-h-[calc(100%-4rem)] w-full overflow-y-auto border shadow-lg shadow-black/5 outline-hidden sm:max-w-md sm:rounded-md',
          className,
        )}
        {...props}
      >
        {children}
        {/* <DialogPrimitive.Close className="group outline-ring focus-visible:outline-ring absolute top-3 right-3 flex size-7 items-center justify-center rounded-md outline-offset-2 transition-colors focus-visible:outline-2 disabled:pointer-events-none">
          <IconX size={16} strokeWidth={2} className="opacity-60 transition-opacity group-hover:opacity-100" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close> */}
      </DialogPrimitive.Content>
    </DialogOverlay>
  </DialogPortal>
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex flex-col space-y-4 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('bg-subtle flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-end', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = ({ className, ...props }: DialogPrimitive.DialogTitleProps) => (
  <DialogPrimitive.Title
    className={cn('border-border border-b p-4 text-base leading-none font-semibold tracking-tight', className)}
    {...props}
  />
)
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = ({ className, ...props }: DialogPrimitive.DialogDescriptionProps) => (
  <DialogPrimitive.Description className={cn('text-muted-foreground px-4 text-sm', className)} {...props} />
)
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
