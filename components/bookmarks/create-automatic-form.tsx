'use client'

import NiceModal from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { createBookmark } from '@/lib/api'
import {
  BOOKMARKS_QUERY,
  DEMO_ROLE,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  NAV_ITEMS_COUNT_QUERY,
  TAG_ITEMS_QUERY,
  TAGS_QUERY,
} from '@/lib/constants'
import { createAutomaticBookmarkSchema } from '@/lib/schemas/form'
import { cn } from '@/lib/utils'
import { useFolders } from '@/hooks/use-folders'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useProfile } from '@/hooks/use-profile'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { CreateTagDialog } from '@/components/dialogs/tags/create-tag'
import { FolderSelectItems } from '@/components/folders/folder-select-items'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

export function CreateAutomaticForm() {
  const { data: profile } = useProfile()
  const appMetadata = profile?.app_metadata
  const { invalidateQueries } = useInvalidateQueries()
  const { data: tags, isLoading: tagsLoading } = useTags()
  const { data: folders, isLoading: foldersLoading } = useFolders()
  const form = useForm<z.infer<typeof createAutomaticBookmarkSchema>>({
    resolver: zodResolver(createAutomaticBookmarkSchema),
    defaultValues: {
      url: '',
      tags: [],
      folderId: '',
      isFavorite: false,
    },
  })

  async function onSubmit(values: z.infer<typeof createAutomaticBookmarkSchema>) {
    const response = await createBookmark(values)

    if (response?.error) {
      toast.error('Error', { description: response.error })
      return
    }

    await invalidateQueries([
      BOOKMARKS_QUERY,
      FOLDERS_QUERY,
      FOLDER_ITEMS_QUERY,
      FAV_BOOKMARKS_QUERY,
      TAGS_QUERY,
      TAG_ITEMS_QUERY,
      NAV_ITEMS_COUNT_QUERY,
    ])
    toast.success('Success', { description: 'Bookmark has been created.' })
    await NiceModal.hide(CreateBookmarkDialog)
    NiceModal.remove(CreateBookmarkDialog)
  }

  return (
    <>
      <p className="my-4 text-center text-sm text-muted-foreground sm:text-left">
        Add the URL and everything will be filled automatically, except for the tags and/or folder.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                      Folder
                      {field.value && (
                        <>
                          <span className="text-muted-foreground"> · </span>
                          <Button variant="link" onClick={() => form.setValue('folderId', '')}>
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
                                <SelectValue placeholder={folders.length > 0 ? 'Select folder' : 'No folders yet'} />
                              </SelectTrigger>
                              <SelectContent>
                                <FolderSelectItems folders={folders} />
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
            <Button size="icon" type="button" onClick={() => NiceModal.show(CreateFolderDialog)}>
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
                    {tagsLoading ? (
                      <Skeleton className="h-9" />
                    ) : (
                      <>
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
                      </>
                    )}
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
    </>
  )
}
