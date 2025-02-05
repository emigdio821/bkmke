import { useState } from 'react'
import type { GenericFn } from '@/types'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/spinner'

interface AlertActionDialogProps<T> {
  title?: React.ReactNode
  message?: React.ReactNode
  action: GenericFn<T>
  destructive?: boolean
  trigger: React.ReactNode
}

export function AlertActionDialog<T>(props: AlertActionDialogProps<T>) {
  const { action, message, title, destructive, trigger } = props
  const [openAlert, setOpenAlert] = useState(false)
  const [isLoading, setLoading] = useState(false)

  async function handleAction() {
    setLoading(true)
    try {
      await action()
      setOpenAlert(false)
    } catch (err) {
      console.log('Alert action dialog error', err)
      toast.error('Error', { description: 'Unable to perform this action, try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog
      open={openAlert}
      onOpenChange={(isOpen) => {
        if (isLoading) return
        setOpenAlert(isOpen)
      }}
    >
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 p-4 pb-0 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="border-border flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden
          >
            <IconAlertCircle className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>{title || 'Are you sure?'}</AlertDialogTitle>
            <AlertDialogDescription>{message || 'This action cannot be undone.'}</AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            variant={destructive ? 'destructive' : 'default'}
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
}
