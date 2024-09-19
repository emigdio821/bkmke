'use client'

import { useMemo, useState } from 'react'
import type { OGInfo } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { BOOKMARKS_QUERY } from '@/lib/constants'
import { createAutomaticBookmarkSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { useFolders } from '@/hooks/use-folders'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

interface CreateAutomaticBookmarkDialogProps {
  trigger?: React.ReactNode
}

export function CreateAutomaticBookmarkDialog({ trigger }: CreateAutomaticBookmarkDialogProps) {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const [openDialog, setOpenDialog] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const { data: tags } = useTags()
  const { data: folders } = useFolders()
  const form = useForm<z.infer<typeof createAutomaticBookmarkSchema>>({
    resolver: zodResolver(createAutomaticBookmarkSchema),
    defaultValues: {
      url: '',
      tags: [],
      folderId: '',
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

  const getFoldersData = useMemo(() => {
    const data = []
    if (folders) {
      for (const folder of folders) {
        data.push({
          label: folder.name,
          value: folder.id.toString(),
        })
      }
    }

    return data
  }, [folders])

  async function onSubmit(values: z.infer<typeof createAutomaticBookmarkSchema>) {
    const { folderId, tags: tagIds, url } = values
    let bookmarkPayload = null

    try {
      const { data: ogInfo } = await axios.get<OGInfo>('/api/og-info', { params: { url } })

      bookmarkPayload = {
        url,
        name: ogInfo.title,
        description: ogInfo.description,
        folder_id: folderId ? Number(folderId) : null,
        og_info: {
          title: ogInfo.title,
          imageUrl: ogInfo.imageUrl,
          faviconUrl: ogInfo.faviconUrl,
          description: ogInfo.description,
        } satisfies OGInfo,
      }
    } catch (err) {
      bookmarkPayload = {
        url,
        name: url,
        description: '',
        folder_id: folderId ? Number(folderId) : null,
        og_info: {
          title: url,
          imageUrl: '',
          faviconUrl: '',
          description: '',
        } satisfies OGInfo,
      }
      console.log('Get og info error:', err)
    }

    const { data: bookmark, error } = await supabase.from('bookmarks').insert(bookmarkPayload).select()

    if (bookmark && bookmark.length > 0 && tagIds.length > 0) {
      const tagItemsPromises = []

      for (const tagId of tagIds) {
        const tagItemsPayload = { bookmark_id: bookmark[0].id, tag_id: Number(tagId) }

        tagItemsPromises.push(supabase.from('tag_items').insert(tagItemsPayload))
      }

      await Promise.all(tagItemsPromises)
    }

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    await queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] })
    setOpenDialog(false)
    setLoading(false)
    toast.success('Success', { description: 'Bookmark created' })
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (form.formState.isSubmitting || isLoading) {
          setOpenDialog(true)
        }
        if (isOpen) form.reset()
        setOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger || <Button variant="outline">Automatic bookmark creation</Button>}</DialogTrigger>

      <DialogContent
        className="max-w-sm"
        aria-describedby={undefined}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Automatic bookmark creation</DialogTitle>
          <DialogDescription>
            Add the URL and everything will be filled automatically, except for the tags and/or folder.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(onSubmit)(e)
            }}
            className="space-y-2"
          >
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
              name="folderId"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      Add to folder
                      {field.value && (
                        <>
                          <span className="text-muted-foreground"> · </span>
                          <Button
                            variant="link"
                            onClick={() => {
                              form.setValue('folderId', '')
                            }}
                          >
                            Clear selection
                          </Button>
                        </>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select folder" />
                        </SelectTrigger>
                        <SelectContent>
                          {getFoldersData.map((folder) => (
                            <SelectItem key={`${folder.value}-folder-select`} value={`${folder.value}`}>
                              {folder.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
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
