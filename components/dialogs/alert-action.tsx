import { useState } from 'react'
import type { GenericFn } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { IconAlertCircle } from '@tabler/icons-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/spinner'

interface AlertActionDialogProps<T> {
  title?: React.ReactNode
  message?: React.ReactNode
  action: GenericFn<T>
}

export const AlertActionDialog = NiceModal.create(<T,>({ action, message, title }: AlertActionDialogProps<T>) => {
  const modal = useModal()
  const [isLoading, setLoading] = useState(false)

  async function handleAction() {
    setLoading(true)
    try {
      await action()
      await modal.hide()
    } catch (err) {
      console.log('Alert action dialog error', err)
      toast.error('Error', { description: 'Unable to perform this action, try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (isLoading) return
        isOpen ? modal.show() : modal.hide()
      }}
    >
      <AlertDialogContent onCloseAutoFocus={() => modal.remove()}>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="border-border flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <IconAlertCircle className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>{title || 'Are you sure?'}</AlertDialogTitle>
            <AlertDialogDescription>{message || 'This action cannot be undone.'}</AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault()
              handleAction()
            }}
          >
            <span className={cn(isLoading && 'invisible')}>Proceed</span>
            {isLoading && <Spinner className="absolute" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})
