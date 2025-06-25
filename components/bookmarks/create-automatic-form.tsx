'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { createBookmark } from '@/lib/api'
import {
  BOOKMARKS_QUERY,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  NAV_ITEMS_COUNT_QUERY,
  TAG_ITEMS_QUERY,
  TAGS_QUERY,
} from '@/lib/constants'
import { createAutomaticBookmarkSchema } from '@/lib/schemas/form'
import { useDialogStore } from '@/lib/stores/dialog'
import { areModificationsEnabled, cn } from '@/lib/utils'
import { useFolders } from '@/hooks/folders/use-folders'
import { useTags } from '@/hooks/tags/use-tags'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { CreateTagDialog } from '@/components/dialogs/tags/create-tag'
import { FolderSelectItems } from '@/components/folders/folder-select-items'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

export function CreateAutomaticForm() {
  const toggleDialog = useDialogStore((state) => state.toggle)
  const toggleDialogLoading = useDialogStore((state) => state.toggleLoading)

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
    toggleDialogLoading(true)
    const response = await createBookmark(values)

    if (response?.error) {
      toggleDialogLoading(false)
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

    toggleDialog(false)
    toggleDialogLoading(false)
    toast.success('Success', { description: 'Bookmark has been created.' })
  }

  return (
    <>
      <Form {...form}>
        <form
          id="create-auto-bk-form"
          className="space-y-4 overflow-y-auto p-4 pt-0"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <p className="text-muted-foreground text-center text-sm sm:text-left">
            Add the URL and everything will be filled automatically, except for the tags and/or folder.
          </p>

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
                  <FormItem id="create-automatic-bk-folder" className="grow">
                    <FormLabel className="self-start">
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
                      <FormControl>
                        {folders && (
                          <Select onValueChange={field.onChange} value={field.value} disabled={!folders.length}>
                            <SelectTrigger id="create-automatic-bk-folder" className="w-full">
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

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        {areModificationsEnabled() && (
          <Button type="submit" form="create-auto-bk-form" disabled={form.formState.isSubmitting}>
            <span className={cn(form.formState.isSubmitting && 'invisible')}>Create</span>
            {form.formState.isSubmitting && <Spinner className="absolute" />}
          </Button>
        )}
      </DialogFooter>
    </>
  )
}
