'use client'

import type { OGInfo } from '@/types'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { CreateTagDialog } from '@/components/dialogs/tags/create-tag'
import { FolderSelectItems } from '@/components/folders/folder-select-items'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useTags } from '@/hooks/tags/use-tags'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useModEnabled } from '@/hooks/use-mod-enabled'
import {
  BOOKMARKS_QUERY,
  FAV_BOOKMARKS_QUERY,
  MAX_DESC_LENGTH,
  MAX_NAME_LENGTH,
  NAV_ITEMS_COUNT_QUERY,
  TAG_ITEMS_QUERY,
  TAGS_QUERY,
} from '@/lib/constants'
import { createManualBookmarkSchema } from '@/lib/schemas/form'
import { useDialogStore } from '@/lib/stores/dialog'
import { createClient } from '@/lib/supabase/client'
import { folderListQuery, FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { cn } from '@/lib/utils'

export function CreateManualForm() {
  const modEnabled = useModEnabled()
  const toggleDialog = useDialogStore((state) => state.toggle)
  const toggleDialogLoading = useDialogStore((state) => state.toggleLoading)

  const supabase = createClient()
  const { invalidateQueries } = useInvalidateQueries()
  const { data: tags, isLoading: tagsLoading } = useTags()
  const { data: folders, isLoading: foldersLoading } = useQuery(folderListQuery())
  const form = useForm<z.infer<typeof createManualBookmarkSchema>>({
    resolver: zodResolver(createManualBookmarkSchema),
    defaultValues: {
      url: '',
      name: '',
      description: '',
      tags: [],
      folderId: '',
      isFavorite: false,
    },
  })

  async function onSubmit(values: z.infer<typeof createManualBookmarkSchema>) {
    toggleDialogLoading(true)
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
      folder_id: folderId || null,
      og_info: ogInfoPayload,
    }

    const { data: bookmark, error } = await supabase.from('bookmarks').insert(bookmarkPayload).select()

    if (bookmark && bookmark.length > 0 && tagIds.length > 0) {
      const tagItemsPromises = []

      for (const tagId of tagIds) {
        const tagItemsPayload = { bookmark_id: bookmark[0].id, tag_id: tagId }

        tagItemsPromises.push(supabase.from('tag_items').insert(tagItemsPayload))
      }

      await Promise.all(tagItemsPromises)
    }

    if (error) {
      toggleDialogLoading(false)
      toast.error('Error', { description: error.message })
      return
    }

    const queryKeysToInvalidate = [
      [BOOKMARKS_QUERY],
      [FAV_BOOKMARKS_QUERY],
      [TAGS_QUERY],
      [TAG_ITEMS_QUERY],
      [NAV_ITEMS_COUNT_QUERY],
    ]

    await invalidateQueries([FOLDERS_QUERY_KEY], { exact: false })
    await invalidateQueries(queryKeysToInvalidate)

    toggleDialog(false)
    toggleDialogLoading(false)
    toast.success('Success', { description: 'Bookmark has been created.' })
  }

  return (
    <>
      <Form {...form}>
        <form id="create-manual-bk-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <p className="text-muted-foreground text-center text-sm sm:text-left">
            Create your bookmark by adding the details by yourself.
          </p>
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
                  <Textarea
                    className="max-h-24"
                    maxLength={MAX_DESC_LENGTH}
                    placeholder="Small description (optional)"
                    {...field}
                  />
                </FormControl>
                <div className="flex items-center justify-between">
                  <FormMessage />
                  <div className="text-muted-foreground flex-auto text-right text-xs tabular-nums">
                    {MAX_DESC_LENGTH - field.value.length} characters left
                  </div>
                </div>
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
                  <FormItem className="grow">
                    <FormLabel htmlFor="select-folder-create-bk-manual-form">Folder</FormLabel>
                    {foldersLoading ? (
                      <Skeleton className="h-9" />
                    ) : (
                      <FormControl>
                        {folders && (
                          <div>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!folders.length}>
                              <SelectTrigger
                                className="w-full"
                                showClearBtn={!!field.value}
                                id="select-folder-create-bk-manual-form"
                                onClear={() => form.setValue('folderId', '')}
                              >
                                <SelectValue placeholder={folders.length > 0 ? 'Select folder' : 'No folders yet'} />
                              </SelectTrigger>
                              <SelectContent>
                                <FolderSelectItems folders={folders} />
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <CreateFolderDialog
              trigger={
                <Button size="icon" type="button">
                  <PlusIcon className="size-4" />
                </Button>
              }
            />
          </div>
          <div className="flex items-end space-x-2">
            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Tags</FormLabel>
                  {tagsLoading ? (
                    <Skeleton className="h-9" />
                  ) : (
                    <FormControl>
                      {tags && (
                        <MultiSelect
                          placeholder="Select tags"
                          options={tags.map((tag) => ({ value: `${tag.id}`, label: tag.name }))}
                          emptyText="No tags yet"
                          onChange={(options) => {
                            form.setValue(field.name, options, { shouldDirty: true, shouldValidate: true })
                          }}
                        />
                      )}
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <CreateTagDialog
              trigger={
                <Button size="icon" type="button">
                  <PlusIcon className="size-4" />
                </Button>
              }
            />
          </div>

          <FormField
            name="isFavorite"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3 shadow-xs">
                <div>
                  <FormLabel>Favorite</FormLabel>
                  <FormDescription>Add this bookmark to the favorites list.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        {modEnabled && (
          <Button type="submit" form="create-manual-bk-form" disabled={form.formState.isSubmitting}>
            <span className={cn(form.formState.isSubmitting && 'invisible')}>Create</span>
            {form.formState.isSubmitting && <Spinner className="absolute" />}
          </Button>
        )}
      </DialogFooter>
    </>
  )
}
