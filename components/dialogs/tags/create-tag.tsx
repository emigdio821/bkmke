'use client'

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
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { MAX_NAME_LENGTH } from '@/lib/constants'
import { createTagSchema } from '@/lib/schemas/form'
import { createTag } from '@/lib/server-actions/tags'
import { TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'
import { cn } from '@/lib/utils'

export function CreateTagDialog({ trigger }: { trigger: React.ReactNode }) {
  const modEnabled = useModEnabled()
  const queryClient = useQueryClient()
  const [openDialog, setOpenDialog] = useState(false)

  const form = useForm<z.infer<typeof createTagSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: '',
    },
  })

  const createTagMutation = useMutation({
    mutationFn: async (values: z.infer<typeof createTagSchema>) => {
      const { error } = await createTag(values.name)

      if (error) {
        throw new Error(error.message)
      }

      return values
    },
    onSuccess: async (values) => {
      await queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] })

      toast.success('Success', {
        description: (
          <div>
            Tag <span className="font-semibold">{values.name}</span> has been created.
          </div>
        ),
      })

      setOpenDialog(false)
    },
    onError: (error: Error) => {
      toast.error('Error', { description: error.message })
    },
  })

  function onSubmit(values: z.infer<typeof createTagSchema>) {
    createTagMutation.mutate(values)
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (createTagMutation.isPending) return
        setOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Create tag</DialogTitle>
        </DialogHeader>

        <DialogDescription className="sr-only">Create tag dialog.</DialogDescription>

        <Form {...form}>
          <form
            id="create-tag-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.stopPropagation()
              form.handleSubmit(onSubmit)(e)
            }}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input maxLength={MAX_NAME_LENGTH} {...field} />
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
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          {modEnabled && (
            <Button type="submit" form="create-tag-form" disabled={createTagMutation.isPending}>
              <span className={cn(createTagMutation.isPending && 'invisible')}>Create</span>
              {createTagMutation.isPending && <Spinner className="absolute" />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
