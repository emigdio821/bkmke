'use client'

import { useCallback, useState } from 'react'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus, IconTrash, IconUpload } from '@tabler/icons-react'
import { useDropzone } from 'react-dropzone'
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
import { importBookmarksSchema } from '@/lib/schemas/form'
import { cn, formatBytes, isAdminRole } from '@/lib/utils'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { InlineCode } from '@/components/ui/typography'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { CreateTagDialog } from '@/components/dialogs/tags/create-tag'
import { FolderSelectItems } from '@/components/folders/folder-select-items'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

const messages = {
  default: 'Unable to import bookmarks at this time, try again.',
  multipleFailure: 'Some bookmarks failed to import, try again.',
}

let completedCount = 0

export const ImportBookmarksDialog = NiceModal.create(() => {
  const modal = useModal()
  const { data: profile } = useProfile()
  const { data: tags, isLoading: tagsLoading } = useTags()
  const { data: folders, isLoading: foldersLoading } = useFolders()
  const [progress, setProgress] = useState(0)
  const { invalidateQueries } = useInvalidateQueries()
  const [dndFiles, setDndFiles] = useState<File[]>([])

  const form = useForm<z.infer<typeof importBookmarksSchema>>({
    resolver: zodResolver(importBookmarksSchema),
    defaultValues: {
      bookmarks: '',
      tags: [],
      folderId: '',
    },
  })

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0]

      if (files.length > 0) {
        setDndFiles(files)
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = () => {
          const result = reader.result?.toString() || ''
          form.setValue('bookmarks', result, {
            shouldValidate: true,
          })
        }
        reader.onerror = () => {
          setDndFiles([])
          toast.error('Error', { description: 'File reading failed, try again.' })
        }
      } else {
        setDndFiles([])
        toast.info('Info', {
          description: (
            <>
              Invalid file, please select only <InlineCode>.txt</InlineCode> files.
            </>
          ),
        })
      }
    },
    [form],
  )

  const { getRootProps, getInputProps, acceptedFiles, isDragActive, inputRef } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  })

  function handleRemoveFile() {
    setDndFiles([])
    form.setValue('bookmarks', '', { shouldValidate: true })
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  async function onSubmit(values: z.infer<typeof importBookmarksSchema>) {
    setProgress(0)
    completedCount = 0

    const bookmarkUrls = values.bookmarks
      .split('\n')
      .filter((url) => url.trim() !== '')
      .map((url) => url.trim())

    if (bookmarkUrls.length === 0) {
      toast.info('Info', { description: 'There are no URLs, try again.' })
      return
    }

    const importPromises = bookmarkUrls.map((url) =>
      createBookmark({
        url,
        tags: values.tags,
        folderId: values.folderId,
        isFavorite: false,
      }).then((result) => {
        if (result?.error) throw new Error(result.error)
        completedCount++
        bookmarkUrls.length > 1 && setProgress((completedCount / totalOperations) * 100)
      }),
    )

    const totalOperations = importPromises.length
    const settledPromises = await Promise.allSettled(importPromises)
    const errors = settledPromises.filter((p) => p.status === 'rejected')

    await invalidateQueries([
      FOLDERS_QUERY,
      BOOKMARKS_QUERY,
      FOLDER_ITEMS_QUERY,
      TAGS_QUERY,
      TAG_ITEMS_QUERY,
      FAV_BOOKMARKS_QUERY,
      NAV_ITEMS_COUNT_QUERY,
    ])

    if (errors.length > 0) {
      toast.error('Error', {
        description: completedCount > 1 ? messages.multipleFailure : messages.default,
      })

      return
    }

    toast.success('Success', {
      description:
        completedCount > 1 ? (
          <>
            <span className="font-semibold">{completedCount}</span> bookmarks have been imported.
          </>
        ) : (
          'Bookmark has been imported.'
        ),
    })

    await modal.hide()
    modal.remove()
  }

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (form.formState.isSubmitting) return
        isOpen ? modal.show() : modal.hide()
      }}
    >
      <DialogContent side="right" onCloseAutoFocus={() => modal.remove()}>
        <DialogHeader>
          <DialogTitle>Import bookmarks</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Import your bookmarks here.</DialogDescription>
        <Form {...form}>
          <form id="import-bk-form" className="flex flex-col overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="drag-and-drop-import" className="pt-4">
              <div className="flex w-full items-center justify-center px-4 sm:justify-start">
                <TabsList>
                  <TabsTrigger value="drag-and-drop-import">Upload file</TabsTrigger>
                  <TabsTrigger value="copy-paste-import">Copy and paste</TabsTrigger>
                </TabsList>
              </div>
              <div className="overflow-y-auto">
                <TabsContent value="drag-and-drop-import" className="space-y-4 rounded-md px-4">
                  <DialogDescription className="px-0 text-center sm:text-left">
                    It must be a plaint text file <InlineCode>.txt</InlineCode> with all the bookamarks URLs separated
                    by a new line.
                  </DialogDescription>

                  <div
                    className={cn(
                      'hover:bg-subtle flex h-28 w-full items-center justify-center rounded-md border border-dashed p-6 transition-colors',
                      {
                        'bg-accent': isDragActive,
                        'border-destructive': form.formState.errors.bookmarks,
                      },
                    )}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                      <IconUpload className="size-4" />
                      <p className="text-muted-foreground text-sm">Drop your file here, or click to select it.</p>
                    </div>
                  </div>

                  {acceptedFiles.length > 0 && dndFiles.length > 0 && (
                    <div>
                      {dndFiles.map((file) => (
                        <span key={file.name} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="text-sm">
                            {file.name}
                            <br />
                            <span className="text-muted-foreground">{formatBytes(file.size)}</span>
                          </p>
                          <Button size="icon" variant="ghost" onClick={handleRemoveFile}>
                            <IconTrash className="size-4" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        </span>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="copy-paste-import" className="space-y-4 rounded-md px-4">
                  <DialogDescription className="px-0 text-center sm:text-left">
                    Copy and paste your bookmarks here, each URL must be separated by a new line.
                  </DialogDescription>
                  <FormField
                    name="bookmarks"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bookmarks</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="max-h-80" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <div className="space-y-4 p-4">
                  <div className="flex w-full items-end space-x-2">
                    <FormField
                      name="folderId"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem className="grow">
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
                              <FormControl>
                                {folders && (
                                  <div>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      disabled={!folders.length}
                                    >
                                      <SelectTrigger>
                                        <SelectValue
                                          placeholder={folders.length > 0 ? 'Select folder' : 'No folders yet'}
                                        />
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

                  {progress > 0 && <Progress value={progress} />}
                </div>
              </div>
            </Tabs>
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          {isAdminRole(profile?.user_role) && (
            <Button type="submit" form="import-bk-form" disabled={form.formState.isSubmitting}>
              <span className={cn(form.formState.isSubmitting && 'invisible')}>Import</span>
              {form.formState.isSubmitting && <Spinner className="absolute" />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
