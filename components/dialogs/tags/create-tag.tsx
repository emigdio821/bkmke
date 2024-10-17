'use client'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { DEMO_ROLE, TAG_ITEMS_QUERY, TAGS_QUERY } from '@/lib/constants'
import { createTagSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useProfile } from '@/hooks/use-profile'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/spinner'

export const CreateTagDialog = NiceModal.create(() => {
  const { data: profile } = useProfile()
  const appMetadata = profile?.app_metadata
  const modal = useModal()
  const supabase = createClient()
  const { invalidateQueries } = useInvalidateQueries()
  const form = useForm<z.infer<typeof createTagSchema>>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(values: z.infer<typeof createTagSchema>) {
    const { error } = await supabase.from('tags').insert(values)

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    toast.success('Success', {
      description: (
        <div>
          Tag <span className="font-semibold">{values.name}</span> has been created.
        </div>
      ),
    })

    await invalidateQueries([TAGS_QUERY, TAG_ITEMS_QUERY])
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
        onCloseAutoFocus={() => {
          modal.remove()
        }}
      >
        <DialogHeader>
          <DialogTitle>Create tag</DialogTitle>
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
                  <FormLabel>Name</FormLabel>
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
