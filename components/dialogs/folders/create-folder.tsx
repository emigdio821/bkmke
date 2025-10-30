'use client'

import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { MAX_DESC_LENGTH, MAX_NAME_LENGTH } from '@/lib/constants'
import { createFolderSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { cn } from '@/lib/utils'

interface CreateFolderDialogProps {
  parentFolderId?: string
  trigger: React.ReactNode
}

export function CreateFolderDialog({ parentFolderId, trigger }: CreateFolderDialogProps) {
  const modEnabled = useModEnabled()
  const [openDialog, setOpenDialog] = useState(false)
  const supabase = createClient()
  const { invalidateQueries } = useInvalidateQueries()

  const form = useForm<z.infer<typeof createFolderSchema>>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  async function onSubmit(values: z.infer<typeof createFolderSchema>) {
    const { error } = await supabase.from('folders').insert({
      ...values,
      parent_id: parentFolderId || null,
    })

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    toast.success('Success', {
      description: (
        <div>
          Folder <span className="font-semibold">{values.name}</span> has been created.
        </div>
      ),
    })

    await invalidateQueries([FOLDERS_QUERY_KEY], { exact: false })
    setOpenDialog(false)
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (form.formState.isSubmitting) return
        setOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Create folder dialog.</DialogDescription>

        <Form {...form}>
          <form
            className="space-y-4"
            id="create-folder-form"
            onSubmit={(e) => {
              e.stopPropagation()
              form.handleSubmit(onSubmit)(e)
            }}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input maxLength={MAX_NAME_LENGTH} {...field} />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    <div className="text-muted-foreground flex-auto text-right text-xs tabular-nums">
                      {MAX_NAME_LENGTH - field.value.length} characters left
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="max-h-24" maxLength={MAX_DESC_LENGTH} {...field} />
                  </FormControl>
                  <div className="text-muted-foreground text-right text-xs tabular-nums">
                    {MAX_DESC_LENGTH - field.value.length} characters left
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          {modEnabled && (
            <Button type="submit" form="create-folder-form" disabled={form.formState.isSubmitting}>
              <span className={cn(form.formState.isSubmitting && 'invisible')}>Create</span>
              {form.formState.isSubmitting && <Spinner className="absolute" />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
