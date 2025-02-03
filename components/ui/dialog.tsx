'use client'

// import { IconX } from '@tabler/icons-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogClose = DialogPrimitive.Close

const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = ({ className, ...props }: DialogPrimitive.DialogOverlayProps) => (
  <DialogPrimitive.Overlay
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 data-[state=closed]:duration-300 data-[state=open]:duration-300',
      className,
    )}
    {...props}
  />
)
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const sheetVariants = cva(
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed z-50 flex max-h-full w-full flex-col shadow-lg shadow-black/5 outline-hidden data-[state=closed]:duration-300 data-[state=open]:duration-300',
  {
    variants: {
      side: {
        top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
        bottom:
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
        left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-8/9 border-r sm:max-w-md',
        right:
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-8/9 border-l sm:max-w-md',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

const dialogStyles = cn(
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 grid max-h-[calc(100%-1rem)] w-full overflow-y-auto border shadow-lg shadow-black/5 outline-hidden data-[state=closed]:duration-300 data-[state=open]:duration-300 sm:max-w-lg sm:rounded-md',
)

interface DialogContentProps extends DialogPrimitive.DialogContentProps, VariantProps<typeof sheetVariants> {}

const DialogContent = ({ side, className, children, ...props }: DialogContentProps) => (
  <DialogPortal>
    <DialogOverlay>
      <DialogPrimitive.Content
        onPointerDownOutside={(e) => {
          if (e.target instanceof Element && e.target.closest('[data-sonner-toast]')) {
            e.preventDefault()
          }
        }}
        className={cn(side ? sheetVariants({ side }) : dialogStyles, className)}
        {...props}
      >
        {/* <DialogPrimitive.Close className="focus:outline-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 outline-hidden transition-opacity hover:opacity-100 focus:outline-hidden focus:outline-2 focus:outline-offset-1 disabled:pointer-events-none">
          <IconX className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close> */}
        {children}
      </DialogPrimitive.Content>
    </DialogOverlay>
  </DialogPortal>
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-2 border-b p-4 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('bg-subtle mt-auto flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-end', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = ({ className, ...props }: DialogPrimitive.DialogTitleProps) => (
  <DialogPrimitive.Title className={cn('text-foreground text-lg font-semibold', className)} {...props} />
)
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = ({ className, ...props }: DialogPrimitive.DialogDescriptionProps) => (
  <DialogPrimitive.Description className={cn('text-muted-foreground text-sm', className)} {...props} />
)
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
