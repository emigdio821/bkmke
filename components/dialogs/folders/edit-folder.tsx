'use client'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import type { Tables } from '@/types/database.types'
import {
  BOOKMARKS_QUERY,
  DEMO_ROLE,
  FAV_BOOKMARKS_QUERY,
  FOLDERS_QUERY,
  MAX_DESC_LENGTH,
  MAX_NAME_LENGTH,
} from '@/lib/constants'
import { createFolderSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
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

export const EditFolderDialog = NiceModal.create(({ folder }: { folder: Tables<'folders'> }) => {
  const { data: profile } = useProfile()
  const appMetadata = profile?.app_metadata
  const modal = useModal()
  const supabase = createClient()
  const { invalidateQueries } = useInvalidateQueries()
  const form = useForm<z.infer<typeof createFolderSchema>>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: folder.name,
      description: folder.description || '',
    },
  })

  async function onSubmit(values: z.infer<typeof createFolderSchema>) {
    const { error } = await supabase.from('folders').update(values).eq('id', folder.id)

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    toast.success('Success', {
      description: 'Folder has been updated.',
    })

    await invalidateQueries([FOLDERS_QUERY, BOOKMARKS_QUERY, FAV_BOOKMARKS_QUERY])
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
          <DialogTitle>Edit folder</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Edit folder dialog</DialogDescription>

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
                      <Input
                        placeholder={folder.name}
                        hasError={!!fieldState.error}
                        maxLength={MAX_NAME_LENGTH}
                        {...field}
                      />
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
                      <Textarea
                        className="max-h-24"
                        maxLength={MAX_DESC_LENGTH}
                        placeholder={folder.description || undefined}
                        {...field}
                      />
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
              <Button type="submit" disabled={form.formState.isSubmitting || appMetadata?.userrole === DEMO_ROLE}>
                <span className={cn(form.formState.isSubmitting && 'invisible')}>Save</span>
                {form.formState.isSubmitting && <Spinner className="absolute" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
