import { useState } from 'react'
import { toast } from 'sonner'
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
import { Spinner } from './spinner'
import { Button } from './ui/button'

interface AlertActionDialogProps<T = unknown> {
  trigger?: React.ReactNode
  action: (...args: never[]) => T | Promise<T>
}

export function AlertActionDialog({ trigger, action }: AlertActionDialogProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const [isLoading, setLoading] = useState(false)

  async function handleAction() {
    setLoading(true)
    try {
      await action()
      setOpenDialog(false)
    } catch (err) {
      console.log('Alert action dialog error', err)
      toast.error('Error', { description: 'Unable to perform this action, try again' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (!isLoading) {
          setOpenDialog(isOpen)
        }
      }}
    >
      <AlertDialogTrigger asChild>{trigger || <Button>Alert</Button>}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault()
              void handleAction()
            }}
          >
            Proceed
            {isLoading && <Spinner className="ml-2" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
