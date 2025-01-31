'use client'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { DEMO_ROLE, FOLDERS_QUERY, MAX_DESC_LENGTH, MAX_NAME_LENGTH } from '@/lib/constants'
import { createFolderSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useProfile } from '@/hooks/use-profile'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/spinner'

interface CreateFolderDialogProps {
  parentFolderId?: string
}

export const CreateFolderDialog = NiceModal.create(({ parentFolderId }: CreateFolderDialogProps) => {
  const { data: profile } = useProfile()
  const appMetadata = profile?.app_metadata
  const modal = useModal()
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
    await modal.hide()
  }

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (form.formState.isSubmitting) return
        isOpen ? modal.show() : modal.hide()
      }}
    >
      <DialogContent className="sm:max-w-sm" onCloseAutoFocus={() => modal.remove()}>
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Create folder dialog.</DialogDescription>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation()
              void form.handleSubmit(onSubmit)(e)
            }}
          >
            <div className="space-y-4 overflow-y-auto p-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input maxLength={MAX_NAME_LENGTH} hasError={!!fieldState.error} {...field} />
                    </FormControl>
                    <div className="text-muted-foreground text-right text-xs tabular-nums">
                      {MAX_NAME_LENGTH - field.value.length} characters left
                    </div>
                    <FormMessage />
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

            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting || appMetadata?.userrole === DEMO_ROLE}>
                <span className={cn(form.formState.isSubmitting && 'invisible')}>Create</span>
                {form.formState.isSubmitting && <Spinner className="absolute" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
