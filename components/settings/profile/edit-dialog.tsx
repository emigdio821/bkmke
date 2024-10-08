'use client'

import { useState } from 'react'
import type { UserMetadata } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@supabase/auth-js'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { PROFILE_QUERY } from '@/lib/constants'
import { editUserSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/spinner'

export function EditDialog({ user }: { user: User }) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [openDialog, setOpenDialog] = useState(false)
  const userMetadata = user.user_metadata as UserMetadata
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: userMetadata?.name || '',
      avatar: userMetadata?.avatar || '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof editUserSchema>) {
    const { error } = await supabase.auth.updateUser({
      password: values.password || undefined,
      data: {
        avatar: values.avatar,
        name: values.name,
        profile_updated_at: new Date(),
      },
    })

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY] })
    setOpenDialog(false)
    toast.success('Success', { description: 'Profile has been updated.' })
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
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        aria-describedby={undefined}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              void form.handleSubmit(onSubmit)(e)
            }}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormDescription>Copy and pase the URL of the desired image.</FormDescription>
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save {form.formState.isSubmitting && <Spinner className="ml-2" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
