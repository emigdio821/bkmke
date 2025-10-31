'use client'

import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { createAutomaticBookmarkSchema } from '@/lib/schemas/form'
import { createBookmark } from '@/lib/server-actions/bookmarks'
import { useDialogStore } from '@/lib/stores/dialog'
import { BOOKMARKS_QUERY_KEY } from '@/lib/ts-queries/bookmarks'
import { folderListQuery, FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { SIDEBAR_ITEM_COUNT_QUERY_KEY } from '@/lib/ts-queries/sidebar'
import { tagListQuery, TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'
import { cn } from '@/lib/utils'

const QUERY_KEYS_TO_INVALIDATE = [
  [BOOKMARKS_QUERY_KEY],
  [SIDEBAR_ITEM_COUNT_QUERY_KEY],
  [FOLDERS_QUERY_KEY],
  [TAGS_QUERY_KEY],
]

export function CreateAutomaticForm() {
  const modEnabled = useModEnabled()
  const queryClient = useQueryClient()
  const { data: tags, isLoading: tagsLoading } = useQuery(tagListQuery())
  const { data: folders, isLoading: foldersLoading } = useQuery(folderListQuery())
  const toggleDialog = useDialogStore((state) => state.toggle)
  const toggleDialogLoading = useDialogStore((state) => state.toggleLoading)

  const form = useForm<z.infer<typeof createAutomaticBookmarkSchema>>({
    resolver: zodResolver(createAutomaticBookmarkSchema),
    defaultValues: {
      url: '',
      tags: [],
      folderId: '',
      isFavorite: false,
    },
  })

  const { mutate: createBookmarkMutate } = useMutation({
    mutationFn: async () => {
      const response = await createBookmark(form.getValues())
      if (response?.error) {
        throw response.error
      }
    },
    onMutate: () => {
      toggleDialogLoading(true)
    },
    onSuccess: async () => {
      await Promise.all(QUERY_KEYS_TO_INVALIDATE.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
      toggleDialog(false)
      toggleDialogLoading(false)
      toast.success('Success', { description: 'Bookmark has been created.' })
    },
    onError: (error) => {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Unable to create bookmark at this time, try again.',
      })
      toggleDialogLoading(false)
    },
  })

  async function onSubmit() {
    createBookmarkMutate()
  }

  return (
    <>
      <p className="text-muted-foreground mb-2 text-center text-sm sm:text-left">
        Add the URL and everything will be filled automatically, except for the tags and/or folder.
      </p>
      <Form {...form}>
        <form id="create-auto-bk-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                    <FormLabel htmlFor="create-automatic-bk-folder">Folder</FormLabel>
                    {foldersLoading ? (
                      <Skeleton className="h-9" />
                    ) : (
                      <FormControl>
                        {folders && (
                          <Select onValueChange={field.onChange} value={field.value} disabled={!folders.length}>
                            <SelectTrigger
                              className="w-full"
                              showClearBtn={!!field.value}
                              id="create-automatic-bk-folder"
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
        </form>
      </Form>

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        {modEnabled && (
          <Button type="submit" form="create-auto-bk-form" disabled={form.formState.isSubmitting}>
            <span className={cn(form.formState.isSubmitting && 'invisible')}>Create</span>
            {form.formState.isSubmitting && <Spinner className="absolute" />}
          </Button>
        )}
      </DialogFooter>
    </>
  )
}
