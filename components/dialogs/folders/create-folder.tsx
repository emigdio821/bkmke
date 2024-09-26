'use client'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { FOLDERS_QUERY } from '@/lib/constants'
import { createFolderSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/spinner'

export const CreateFolderDialog = NiceModal.create(() => {
  const modal = useModal()
  const queryClient = useQueryClient()
  const supabase = createClient()
  const form = useForm<z.infer<typeof createFolderSchema>>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(values: z.infer<typeof createFolderSchema>) {
    const { error } = await supabase.from('folders').insert(values)

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
        if (isOpen) {
          void modal.show()
        } else {
          void modal.hide()
        }
      }}
    >
      <DialogContent
        className="max-w-xs"
        aria-describedby={undefined}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        onCloseAutoFocus={() => {
          modal.remove()
        }}
      >
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation()
              void form.handleSubmit(onSubmit)(e)
            }}
            className="space-y-2"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save {form.formState.isSubmitting && <Spinner className="ml-2" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
