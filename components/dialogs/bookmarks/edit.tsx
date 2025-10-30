'use client'

import type { BkOGInfo, Bookmark } from '@/types'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FolderSelectItems } from '@/components/folders/folder-select-items'
import { MultiSelect } from '@/components/multi-select'
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
  TAG_ITEMS_QUERY,
  TAGS_QUERY,
} from '@/lib/constants'
import { editBookmarkSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { folderListQuery, FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { cn } from '@/lib/utils'

interface EditBookmarkDialogProps {
  bookmark: Bookmark
  trigger: React.ReactNode
}

export function EditBookmarkDialog({ bookmark, trigger }: EditBookmarkDialogProps) {
  const modEnabled = useModEnabled()
  const [openDialog, setOpenDialog] = useState(false)
  const { invalidateQueries } = useInvalidateQueries()
  const ogInfo = bookmark.og_info as unknown as BkOGInfo
  const { data: tags, isLoading: tagsLoading } = useTags()
  const { data: folders, isLoading: foldersLoading } = useQuery(folderListQuery())
  const supabase = createClient()
  const tagItems = bookmark.tag_items
    .map((item) => item.tag?.id)
    .filter((id) => id !== undefined)
    .map((id) => id.toString())

  const form = useForm<z.infer<typeof editBookmarkSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(editBookmarkSchema),
    defaultValues: {
      url: bookmark.url,
      name: bookmark.name,
      description: bookmark.description || '',
      tags: tagItems,
      folderId: bookmark.folder_id?.toString() || '',
      imageUrl: ogInfo.imageUrl,
      faviconUrl: ogInfo.faviconUrl,
      updateOG: false,
      isFavorite: bookmark.is_favorite,
    },
  })

  async function onSubmit(values: z.infer<typeof editBookmarkSchema>) {
    const { name, description, isFavorite, url, tags: tagIds, folderId, updateOG, faviconUrl, imageUrl } = values

    let ogInfoPayload = null

    if (updateOG) {
      ogInfoPayload = {
        imageUrl,
        faviconUrl,
      } satisfies BkOGInfo
    } else {
      ogInfoPayload = {
        imageUrl: ogInfo.imageUrl,
        faviconUrl: ogInfo.faviconUrl,
      }
    }

    const bookmarkPayload = {
      url,
      name,
      description,
      og_info: ogInfoPayload,
      is_favorite: isFavorite,
      folder_id: folderId || null,
    }

    const { data: bookmarkData, error } = await supabase
      .from('bookmarks')
      .update(bookmarkPayload)
      .eq('id', bookmark.id)
      .select()

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    if (bookmarkData.length && tagIds.length > 0) {
      const bookmarkId = bookmarkData[0].id
      const tagItemsPayload = tagIds.map((tagId) => ({
        tag_id: tagId,
        bookmark_id: bookmarkId,
      }))

      await supabase.from('tag_items').upsert(tagItemsPayload, { onConflict: 'bookmark_id, tag_id' })
      const remainingTags = tagIds.join(',')
      await supabase.from('tag_items').delete().eq('bookmark_id', bookmarkId).not('tag_id', 'in', `(${remainingTags})`)
    } else {
      await supabase.from('tag_items').delete().eq('bookmark_id', bookmark.id)
    }

    const queryKeysToInvalidate = [[BOOKMARKS_QUERY], [TAG_ITEMS_QUERY], [TAGS_QUERY], [FAV_BOOKMARKS_QUERY]]

    await invalidateQueries([FOLDERS_QUERY_KEY], { exact: false })
    await invalidateQueries(queryKeysToInvalidate)
    form.reset(values)
    setOpenDialog(false)
    toast.success('Success', { description: 'Bookmark has been updated.' })
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit bookmark</DialogTitle>
          <DialogDescription className="p-0 wrap-break-word">{bookmark.name}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="edit-bk-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder={bookmark.name} maxLength={MAX_NAME_LENGTH} {...field} />
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
                      placeholder={bookmark.description || undefined}
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
                    <Input placeholder={bookmark.url} {...field} />
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
                      <FormLabel htmlFor="select-folder-edit-bk-form">Folder</FormLabel>
                      {foldersLoading ? (
                        <Skeleton className="h-9" />
                      ) : (
                        <FormControl>
                          {folders && (
                            <Select onValueChange={field.onChange} value={field.value} disabled={!folders.length}>
                              <SelectTrigger
                                className="w-full"
                                showClearBtn={!!field.value}
                                id="select-folder-edit-bk-form"
                                onClear={() => form.setValue('folderId', '')}
                              >
                                <SelectValue placeholder={folders.length > 0 ? 'Select folder' : 'No folders yet'} />
                              </SelectTrigger>
                              <SelectContent>
                                <FolderSelectItems folders={folders} />
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
            <div className="flex items-end space-x-2">
              <FormField
                name="tags"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Tags</FormLabel>
                    {tagsLoading ? (
                      <Skeleton className="h-9" />
                    ) : (
                      <FormControl>
                        {tags && (
                          <MultiSelect
                            value={bookmark.tag_items
                              .map((item) => item.tag?.id)
                              .filter((id) => id !== undefined)
                              .map((id) => id.toString())}
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
            </div>

            <FormField
              name="isFavorite"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-md border p-3 shadow-xs">
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

            <FormField
              name="updateOG"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-2 rounded-md border p-3 shadow-xs">
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Images</FormLabel>
                        <FormDescription>Update bookmark images manually.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                  </FormItem>

                  <div
                    className={cn('space-y-2 border-t border-dashed pt-2', {
                      hidden: !form.getValues('updateOG'),
                    })}
                  >
                    <FormField
                      name="faviconUrl"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <div>
                            <FormLabel>Favicon URL</FormLabel>
                            <FormDescription>Copy and pase the URL of the desired image.</FormDescription>
                          </div>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="imageUrl"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <div>
                            <FormLabel>Image URL</FormLabel>
                            <FormDescription>Copy and pase the URL of the desired image.</FormDescription>
                          </div>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
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
            <Button type="submit" form="edit-bk-form" disabled={form.formState.isSubmitting}>
              <span className={cn(form.formState.isSubmitting && 'invisible')}>Save</span>
              {form.formState.isSubmitting && <Spinner className="absolute" />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
