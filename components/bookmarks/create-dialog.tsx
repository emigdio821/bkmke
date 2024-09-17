'use client'

import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { BOOKMARKS_QUERY } from '@/lib/constants'
import { createBookmarkSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

interface CreateBookmarkDialogProps {
  trigger?: React.ReactNode
}

export function CreateBookmarkDialog({ trigger }: CreateBookmarkDialogProps) {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const [openDialog, setOpenDialog] = useState(false)
  const { data: tags } = useTags()
  const form = useForm<z.infer<typeof createBookmarkSchema>>({
    resolver: zodResolver(createBookmarkSchema),
    defaultValues: {
      url: '',
      name: '',
      description: '',
      tags: [],
    },
  })

  const getTagsData = useMemo(() => {
    const data = []
    if (tags) {
      for (const tag of tags) {
        data.push({
          label: tag.name,
          value: tag.id.toString(),
        })
      }
    }

    return data
  }, [tags])

  async function onSubmit(values: z.infer<typeof createBookmarkSchema>) {
    const { name, description, url, tags: tagIds } = values
    const bookmarkPaylaod = {
      name,
      description,
      url,
    }
    const { data: bookmark, error } = await supabase.schema('public').from('bookmarks').insert(bookmarkPaylaod).select()

    if (bookmark && bookmark.length > 0 && tagIds.length > 0) {
      const tagItemsPromises = []

      for (const tagId of tagIds) {
        const tagItemsPayload = { bookmark_id: bookmark[0].id, tag_id: Number(tagId) }

        tagItemsPromises.push(supabase.schema('public').from('tag_items').insert(tagItemsPayload))
      }

      await Promise.all(tagItemsPromises)
    }

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    await queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] })
    setOpenDialog(false)
    toast.success('Success', { description: 'Folder created' })
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (form.formState.isSubmitting) {
          setOpenDialog(true)
        }
        if (isOpen) form.reset()
        setOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger || <Button variant="outline">Create bookmark</Button>}</DialogTrigger>

      <DialogContent
        className="max-w-sm"
        aria-describedby={undefined}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Create bookmark</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(onSubmit)(e)
            }}
            className="space-y-2"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bookmark name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Textarea className="max-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="url"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      title="Tags"
                      options={getTagsData}
                      onChange={(options) => {
                        form.setValue(field.name, options, { shouldDirty: true, shouldValidate: true })
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Create {form.formState.isSubmitting && <Spinner className="ml-2" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
