'use client'

import type { Tables } from '@/types/database.types'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
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
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { MAX_NAME_LENGTH } from '@/lib/constants'
import { createTagSchema } from '@/lib/schemas/form'
import { updateTag } from '@/lib/server-actions/tags'
import { BOOKMARKS_QUERY_KEY } from '@/lib/ts-queries/bookmarks'
import { TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'
import { cn } from '@/lib/utils'

interface EditTagDialogProps {
  trigger: React.ReactNode
  tag: Tables<'tags'>
}

const QUERY_KEYS_TO_INVALIDATE = [[BOOKMARKS_QUERY_KEY], [TAGS_QUERY_KEY]]

export function EditTagDialog({ tag, trigger }: EditTagDialogProps) {
  const modEnabled = useModEnabled()
  const queryClient = useQueryClient()
  const [openDialog, setOpenDialog] = useState(false)

  const form = useForm<z.infer<typeof createTagSchema>>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: tag.name,
    },
  })

  async function onSubmit(values: z.infer<typeof createTagSchema>) {
    const { error } = await updateTag(tag.id, values)

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    await Promise.all(QUERY_KEYS_TO_INVALIDATE.map((queryKey) => queryClient.invalidateQueries({ queryKey })))

    toast.success('Success', {
      description: 'Tag has been updated.',
    })

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
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Edit tag</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Edit tag dialog</DialogDescription>

        <Form {...form}>
          <form
            id="edit-tag-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.stopPropagation()
              void form.handleSubmit(onSubmit)(e)
            }}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder={tag.name} maxLength={MAX_NAME_LENGTH} {...field} />
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
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          {modEnabled && (
            <Button type="submit" form="edit-tag-form" disabled={form.formState.isSubmitting}>
              <span className={cn(form.formState.isSubmitting && 'invisible')}>Save</span>
              {form.formState.isSubmitting && <Spinner className="absolute" />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
