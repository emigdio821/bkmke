'use client'

import { Fragment } from 'react'
import type { BkOGInfo, Bookmark } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconChevronRight } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import {
  BOOKMARKS_QUERY,
  DEMO_ROLE,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  MAX_INPUT_LENGTH,
  TAG_ITEMS_QUERY,
  TAGS_QUERY,
} from '@/lib/constants'
import { editBookmarkSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useFolders } from '@/hooks/use-folders'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useProfile } from '@/hooks/use-profile'
import { useTags } from '@/hooks/use-tags'
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

export const EditBookmarkDialog = NiceModal.create(({ bookmark }: { bookmark: Bookmark }) => {
  const modal = useModal()
  const { data: profile } = useProfile()
  const appMetadata = profile?.app_metadata
  const { invalidateQueries } = useInvalidateQueries()
  const ogInfo = bookmark.og_info as unknown as BkOGInfo
  const { data: tags, isLoading: tagsLoading } = useTags()
  const { data: folders, isLoading: foldersLoading } = useFolders()
  const supabase = createClient()
  const tagItems = bookmark.tag_items
    .map((item) => item.tag?.id)
    .filter((id) => id !== undefined)
    .map((id) => id.toString())
  const form = useForm<z.infer<typeof editBookmarkSchema>>({
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

    await invalidateQueries([BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY, TAGS_QUERY, FAV_BOOKMARKS_QUERY])
    toast.success('Success', { description: 'Bookmark has been updated.' })
    await modal.hide()
    modal.remove()
  }

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          void modal.show()
        } else {
          void modal.hide()
        }
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        onCloseAutoFocus={() => {
          modal.remove()
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit bookmark</DialogTitle>
          <DialogDescription className="break-words">{bookmark.name}</DialogDescription>
        </DialogHeader>
        <div>
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder={bookmark.name} maxLength={MAX_INPUT_LENGTH} {...field} />
                    </FormControl>
                    {field.value.length >= MAX_INPUT_LENGTH - 20 && (
                      <span className="text-xs text-muted-foreground">
                        {field.value.length}/{MAX_INPUT_LENGTH} characters
                      </span>
                    )}
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
                        maxLength={MAX_INPUT_LENGTH}
                        placeholder={bookmark.description || undefined}
                        {...field}
                      />
                    </FormControl>
                    {field.value.length >= MAX_INPUT_LENGTH - 20 && (
                      <span className="text-xs text-muted-foreground">
                        {field.value.length}/{MAX_INPUT_LENGTH} characters
                      </span>
                    )}
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
                      <FormItem className="flex-grow">
                        <FormLabel>
                          Folder
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
                        {foldersLoading ? (
                          <Skeleton className="h-9" />
                        ) : (
                          <>
                            {folders && (
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!folders.length}>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={folders.length > 0 ? 'Select folder' : 'No folders yet'}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {folders.map((folder) => (
                                      <Fragment key={`parent-folder-${folder.id}`}>
                                        <SelectItem value={`${folder.id}`}>{folder.name}</SelectItem>
                                        {folder.children.map((subfolder) => (
                                          <SelectItem key={`subfolder-${subfolder.id}`} value={`${subfolder.id}`}>
                                            <span className="flex items-center">
                                              <span className="text-xs text-muted-foreground">{folder.name}</span>
                                              <IconChevronRight className="size-3.5 text-muted-foreground" />
                                              {subfolder.name}
                                            </span>
                                          </SelectItem>
                                        ))}
                                      </Fragment>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            )}
                          </>
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
                    <FormItem className="flex-1">
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        {tagsLoading ? (
                          <Skeleton className="h-9" />
                        ) : (
                          <>
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
                          </>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="isFavorite"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-3 shadow-sm">
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
                  <div className="space-y-2 rounded-md border p-3 shadow-sm">
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Images</FormLabel>
                        <FormDescription>Update bookmark images manually.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>

                    {form.getValues('updateOG') && (
                      <div className="space-y-2 border-t border-dashed pt-2">
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
                    )}
                  </div>
                )}
              />

              <DialogFooter className="pt-6">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
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
        </div>
      </DialogContent>
    </Dialog>
  )
})
