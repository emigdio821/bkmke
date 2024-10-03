'use client'

import { useMemo } from 'react'
import type { OGInfo } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY } from '@/lib/constants'
import { createManualBookmarkSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { useFolders } from '@/hooks/use-folders'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { CreateTagDialog } from '@/components/dialogs/tags/create-tag'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

export function CreateManualForm() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const { data: tags } = useTags()
  const { data: folders } = useFolders()
  const form = useForm<z.infer<typeof createManualBookmarkSchema>>({
    resolver: zodResolver(createManualBookmarkSchema),
    defaultValues: {
      url: '',
      name: '',
      description: '',
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

  async function onSubmit(values: z.infer<typeof createManualBookmarkSchema>) {
    const { name, description, url, tags: tagIds, folderId } = values

    let ogInfoPayload = null

    try {
      const { data: ogInfo } = await axios.get<OGInfo>('/api/og-info', { params: { url } })

      ogInfoPayload = {
        title: ogInfo.title,
        imageUrl: ogInfo.imageUrl,
        faviconUrl: ogInfo.faviconUrl,
        description: ogInfo.description,
      } satisfies OGInfo
    } catch (err) {
      ogInfoPayload = {
        title: name,
        description,
        imageUrl: '',
        faviconUrl: '',
      } satisfies OGInfo
      console.log('Get og info error:', err)
    }

    const bookmarkPayload = {
      url,
      name,
      description,
      folder_id: folderId ? Number(folderId) : null,
      og_info: ogInfoPayload,
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
    await queryClient.invalidateQueries({ queryKey: [FOLDER_ITEMS_QUERY] })
    await queryClient.invalidateQueries({ queryKey: [TAG_ITEMS_QUERY] })
    toast.success('Success', { description: 'Bookmark has been created.' })
    await NiceModal.hide(CreateBookmarkDialog)
    NiceModal.remove(CreateBookmarkDialog)
  }

  return (
    <>
      <p className="my-4 text-sm text-muted-foreground">Create your bookmark by adding the details by yourself.</p>
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
                  <Textarea className="max-h-40" {...field} />
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

          <div className="flex w-full items-end space-x-2">
            <FormField
              name="folderId"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="flex-grow">
                    <FormLabel>
                      Move to folder
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
                      <Select onValueChange={field.onChange} value={field.value} disabled={!getFoldersData.length}>
                        <SelectTrigger>
                          <SelectValue placeholder={getFoldersData.length > 0 ? 'Select folder' : 'No folders yet'} />
                        </SelectTrigger>
                        <SelectContent>
                          {getFoldersData.map((folder) => (
                            <SelectItem key={`${folder.value}-folder-select`} value={folder.value}>
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
            <Button
              size="icon"
              type="button"
              onClick={() => {
                void NiceModal.show(CreateFolderDialog)
              }}
            >
              <IconPlus className="size-4" />
            </Button>
          </div>
          <div className="flex items-end space-x-2">
            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select tags"
                      options={getTagsData}
                      emptyText="No tags yet"
                      onChange={(options) => {
                        form.setValue(field.name, options, { shouldDirty: true, shouldValidate: true })
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size="icon"
              type="button"
              onClick={() => {
                void NiceModal.show(CreateTagDialog)
              }}
            >
              <IconPlus className="size-4" />
            </Button>
          </div>
          <DialogFooter className="pt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Create {form.formState.isSubmitting && <Spinner className="ml-2" />}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
