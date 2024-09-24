'use client'

import { useCallback, useMemo, useState } from 'react'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus, IconTrash, IconUpload } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { createBookmark } from '@/lib/api'
import { BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY } from '@/lib/constants'
import { importBookmarksSchema } from '@/lib/schemas/form'
import { cn, formatBytes } from '@/lib/utils'
import { useFolders } from '@/hooks/use-folders'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { TypographyInlineCode } from '@/components/ui/typography'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { CreateTagDialog } from '@/components/dialogs/tags/create-tag'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

export const ImportBookmarksDialog = NiceModal.create(() => {
  const modal = useModal()
  const queryClient = useQueryClient()
  const { data: tags } = useTags()
  const { data: folders } = useFolders()
  const [dndFiles, setDndFiles] = useState<File[]>([])
  const form = useForm<z.infer<typeof importBookmarksSchema>>({
    resolver: zodResolver(importBookmarksSchema),
    defaultValues: {
      bookmarks: [],
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

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0]

      if (files.length > 0) {
        setDndFiles(files)
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = () => {
          const result = reader.result?.toString() || ''
          form.setValue('bookmarks', result.split('\n'), {
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
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  async function onSubmit(values: z.infer<typeof importBookmarksSchema>) {
    if (values.bookmarks.length === 0) {
      toast.info('Info', { description: 'There are no URLs, try again.' })
      return
    }
    const bookmarkPromises = []

    for (const bookmarkUrl of values.bookmarks) {
      const payload = {
        folderId: values.folderId,
        tags: values.tags,
        url: bookmarkUrl,
      }

      bookmarkPromises.push(createBookmark(payload))
    }

    try {
      await Promise.all(bookmarkPromises)
      await queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] })
      await queryClient.invalidateQueries({ queryKey: [FOLDER_ITEMS_QUERY] })
      await queryClient.invalidateQueries({ queryKey: [TAG_ITEMS_QUERY] })
      toast.success('Success', { description: 'Bookmarks has been imported.' })
      await modal.hide()
      modal.remove()
    } catch {
      toast.error('Error', { description: 'Unable to import bookmarks at this time, try again.' })
    }
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
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select folder" />
                          </SelectTrigger>
                          <SelectContent>
                            {getFoldersData.map((folder) => (
                              <SelectItem key={`${folder.value}-folder-select`} value={`${folder.value}`}>
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
            <DialogFooter>
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
