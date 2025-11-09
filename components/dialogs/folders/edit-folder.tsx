'use client'

import type { Tables } from '@/types/database.types'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { MAX_DESC_LENGTH, MAX_NAME_LENGTH } from '@/lib/constants'
import { createFolderSchema } from '@/lib/schemas/form'
import { updateFolder } from '@/lib/server-actions/folders'
import { BOOKMARKS_QUERY_KEY } from '@/lib/ts-queries/bookmarks'
import { FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { cn } from '@/lib/utils'

interface EditFolderDialogProps {
  folder: Tables<'folders'>
  trigger: React.ReactNode
}

const QUERY_KEYS_TO_INVALIDATE = [[BOOKMARKS_QUERY_KEY], [FOLDERS_QUERY_KEY]]

export function EditFolderDialog({ folder, trigger }: EditFolderDialogProps) {
  const modEnabled = useModEnabled()
  const queryClient = useQueryClient()
  const [openDialog, setOpenDialog] = useState(false)

  const form = useForm<z.infer<typeof createFolderSchema>>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: folder.name,
      description: folder.description || '',
    },
  })

  const updateFolderMutation = useMutation({
    mutationFn: async (values: z.infer<typeof createFolderSchema>) => {
      const { error } = await updateFolder(values, folder.id)

      if (error) {
        throw new Error(error.message)
      }

      return values
    },
    onSuccess: async () => {
      await Promise.all(QUERY_KEYS_TO_INVALIDATE.map((queryKey) => queryClient.invalidateQueries({ queryKey })))

      setOpenDialog(false)

      toast.success('Success', {
        description: 'Folder has been updated.',
      })
    },
    onError: (error: Error) => {
      toast.error('Error', { description: error.message })
    },
  })

  function onSubmit(values: z.infer<typeof createFolderSchema>) {
    updateFolderMutation.mutate(values)
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (updateFolderMutation.isPending) return
        setOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit folder</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Edit folder dialog</DialogDescription>

        <Form {...form}>
          <form
            id="edit-folder-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.stopPropagation()
              void form.handleSubmit(onSubmit)(e)
            }}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder={folder.name} maxLength={MAX_NAME_LENGTH} {...field} />
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
                      placeholder={folder.description || undefined}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-muted-foreground text-right text-xs tabular-nums">
                    {MAX_DESC_LENGTH - field.value.length} characters left
                  </div>
                  <FormMessage />
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
          {modEnabled && (
            <Button type="submit" form="edit-folder-form" disabled={updateFolderMutation.isPending}>
              <span className={cn(updateFolderMutation.isPending && 'invisible')}>Save</span>
              {updateFolderMutation.isPending && <Spinner className="absolute" />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
