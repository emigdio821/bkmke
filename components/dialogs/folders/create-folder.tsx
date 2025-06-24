'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { FOLDERS_QUERY, MAX_DESC_LENGTH, MAX_NAME_LENGTH } from '@/lib/constants'
import { createFolderSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { areModificationsEnabled, cn } from '@/lib/utils'
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
import { Spinner } from '@/components/spinner'

interface CreateFolderDialogProps {
  parentFolderId?: string
  trigger: React.ReactNode
}

export function CreateFolderDialog({ parentFolderId, trigger }: CreateFolderDialogProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const queryClient = useQueryClient()
  const supabase = createClient()

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
    await queryClient.invalidateQueries({ queryKey: [FOLDERS_QUERY] })
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
            onSubmit={(e) => {
              e.stopPropagation()
              form.handleSubmit(onSubmit)(e)
            }}
          >
            <div className="space-y-4 overflow-y-auto p-4">
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
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              {areModificationsEnabled() && (
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <span className={cn(form.formState.isSubmitting && 'invisible')}>Create</span>
                  {form.formState.isSubmitting && <Spinner className="absolute" />}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
