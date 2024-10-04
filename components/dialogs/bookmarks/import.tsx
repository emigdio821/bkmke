'use client'

import { Fragment, useCallback, useState } from 'react'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconChevronRight, IconPlus, IconTrash, IconUpload } from '@tabler/icons-react'
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
  TAG_ITEMS_QUERY,
} from '@/lib/constants'
import { importBookmarksSchema } from '@/lib/schemas/form'
import { cn, formatBytes } from '@/lib/utils'
import { useFolders } from '@/hooks/use-folders'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { TypographyInlineCode } from '@/components/ui/typography'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { CreateTagDialog } from '@/components/dialogs/tags/create-tag'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

const singleFailureMessage = 'Unable to import bookmark at this time, try again.'
const multipleFailureMessage = 'Some bookmarks failed to import, try again.'

export const ImportBookmarksDialog = NiceModal.create(() => {
  const modal = useModal()
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
              Invalid file, please select only <TypographyInlineCode>.txt</TypographyInlineCode> files.
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
    const bookmarkUrls = values.bookmarks
      .split('\n')
      .filter((url) => url.trim() !== '')
      .map((url) => url.trim())

    if (bookmarkUrls.length === 0) {
      toast.info('Info', { description: 'There are no URLs, try again.' })
      return
    }

    let completedCount = 0
    const importPromises = bookmarkUrls.map(async (url) => {
      await createBookmark({
        url,
        tags: values.tags,
        folderId: values.folderId,
        isFavorite: false,
      }).then((result) => {
        completedCount++
        setProgress((completedCount / totalOperations) * 100)
        if (result?.error) {
          throw new Error(result.error)
        }
      })
    })

    const areMultipleBks = importPromises.length > 1
    const totalOperations = importPromises.length
    const settledPromises = await Promise.allSettled(importPromises)

    setProgress((completedCount / totalOperations) * 100)

    const resultsArray = []
    const errorsArray = []

    for (const promise of settledPromises) {
      if (promise.status === 'fulfilled') {
        resultsArray.push(promise.value)
      } else {
        errorsArray.push(promise.reason)
      }
    }

    if (errorsArray.length > 0) {
      toast.error('Error', {
        description: areMultipleBks ? multipleFailureMessage : singleFailureMessage,
      })
    } else {
      await invalidateQueries([
        FOLDERS_QUERY,
        BOOKMARKS_QUERY,
        FOLDER_ITEMS_QUERY,
        TAG_ITEMS_QUERY,
        FAV_BOOKMARKS_QUERY,
      ])
      toast.success('Success', {
        description: areMultipleBks ? (
          <>
            <span className="font-semibold">{resultsArray.length}</span> bookmarks have been imported.
          </>
        ) : (
          'Bookmark has been imported.'
        ),
      })
    }

    await modal.hide()
    modal.remove()
  }

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (form.formState.isSubmitting) return
        if (isOpen) {
          void modal.show()
        } else {
          void modal.hide()
        }
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        onCloseAutoFocus={() => {
          modal.remove()
        }}
      >
        <DialogHeader>
          <DialogTitle>Import bookmarks</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(onSubmit)(e)
            }}
            className="space-y-2"
          >
            <Tabs defaultValue="drag-and-drop-import">
              <div className="flex w-full items-center justify-center sm:justify-start">
                <TabsList>
                  <TabsTrigger value="drag-and-drop-import">Upload file</TabsTrigger>
                  <TabsTrigger value="copy-paste-import">Copy and paste</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="drag-and-drop-import" className="space-y-2 rounded-lg">
                <DialogDescription>
                  It must be a plaint text file <TypographyInlineCode>.txt</TypographyInlineCode> with all the
                  bookamarks URLs separated by a new line.
                </DialogDescription>

                <div
                  className={cn(
                    'flex h-28 w-full items-center justify-center rounded-lg border border-dashed p-6 transition-colors hover:bg-accent',
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
                    <p className="text-sm text-muted-foreground">Drop your file here, or click to select it.</p>
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
              <TabsContent value="copy-paste-import" className="rounded-lg">
                <DialogDescription>
                  Copy and paste your bookmarks here, each URL must be separated by a new line.
                </DialogDescription>
                <FormField
                  name="bookmarks"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bookmarks</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-28 max-h-80" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

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
            {progress > 0 && <Progress value={progress} />}
            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Import {form.formState.isSubmitting && <Spinner className="ml-2" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
