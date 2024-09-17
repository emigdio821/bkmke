import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { TAGS_QUERY } from '@/lib/constants'
import { createTagSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Spinner } from './spinner'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface CreateTagDialogProps {
  trigger?: React.ReactNode
}

export function CreateTagDialog({ trigger }: CreateTagDialogProps) {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const [openDialog, setOpenDialog] = useState(false)
  const form = useForm<z.infer<typeof createTagSchema>>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(values: z.infer<typeof createTagSchema>) {
    const { error } = await supabase.schema('public').from('tags').insert(values)

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    await queryClient.invalidateQueries({ queryKey: [TAGS_QUERY] })
    setOpenDialog(false)
    toast.success('Success', { description: 'Tag created' })
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (form.formState.isSubmitting) {
          setOpenDialog(true)
        }
        setOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger || <Button variant="outline">Create tag</Button>}</DialogTrigger>
      <DialogContent
        className="max-w-sm"
        aria-describedby={undefined}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Create tag</DialogTitle>
        </DialogHeader>

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
                  <FormLabel>Tag name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                Save {form.formState.isSubmitting && <Spinner className="ml-2" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
