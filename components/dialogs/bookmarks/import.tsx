'use client'

import { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileUpIcon, PlusIcon, Trash2Icon } from 'lucide-react'
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
import { cn, formatBytes } from '@/lib/utils'
import { useFolders } from '@/hooks/folders/use-folders'
import { useTags } from '@/hooks/tags/use-tags'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useModEnabled } from '@/hooks/use-mod-enabled'
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

export function ImportBookmarksDialog({ trigger }: { trigger: React.ReactNode }) {
  const modEnabled = useModEnabled()
  const [openDialog, setOpenDialog] = useState(false)
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

    setOpenDialog(false)
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
          <DialogTitle>Import bookmarks</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Import your bookmarks here.</DialogDescription>
        <Form {...form}>
          <form id="import-bk-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="drag-and-drop-import">
              <TabsList>
                <TabsTrigger value="drag-and-drop-import">Upload file</TabsTrigger>
                <TabsTrigger value="copy-paste-import">Copy and paste</TabsTrigger>
              </TabsList>
              <TabsContent value="drag-and-drop-import" className="space-y-4">
                <DialogDescription className="px-0 text-center sm:text-left">
                  It must be a plaint text file <InlineCode>.txt</InlineCode> with all the bookamarks URLs separated by
                  a new line.
                </DialogDescription>

                <div
                  className={cn(
                    'outline-ring hover:bg-muted flex h-28 w-full items-center justify-center rounded-md border border-dashed p-6 outline-hidden outline-offset-2 transition-colors focus-visible:outline-2',
                    {
                      'bg-accent': isDragActive,
                      'border-destructive': form.formState.errors.bookmarks,
                    },
                  )}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <FileUpIcon className="text-muted-foreground size-4" />
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
                          <Trash2Icon className="size-4" />
                          <span className="sr-only">Remove file</span>
                        </Button>
                      </span>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="copy-paste-import" className="space-y-4">
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
                        <Textarea {...field} className="max-h-80 min-h-[90px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <div className="mt-4 space-y-4">
                <div className="flex w-full items-end space-x-2">
                  <FormField
                    name="folderId"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <FormItem className="grow">
                          <FormLabel htmlFor="folder-select-import-bk-form">Folder</FormLabel>
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
                                      id="folder-select-import-bk-form"
                                      onClear={() => form.setValue('folderId', '')}
                                    >
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

                {progress > 0 && <Progress value={progress} />}
              </div>
            </Tabs>
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          {modEnabled && (
            <Button type="submit" form="import-bk-form" disabled={form.formState.isSubmitting}>
              <span className={cn(form.formState.isSubmitting && 'invisible')}>Import</span>
              {form.formState.isSubmitting && <Spinner className="absolute" />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
