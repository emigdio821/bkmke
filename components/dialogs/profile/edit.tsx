'use client'

import type { UserMetadata } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@supabase/auth-js'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { PROFILE_QUERY } from '@/lib/constants'
import { editUserSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input, PasswordInput } from '@/components/ui/input'
import { Spinner } from '@/components/spinner'

export const EditDialog = NiceModal.create(({ user }: { user: User }) => {
  const modal = useModal()
  const supabase = createClient()
  const queryClient = useQueryClient()
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
    await modal.hide()
    toast.success('Success', { description: 'Profile has been updated.' })
  }

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (form.formState.isSubmitting) return
        isOpen ? modal.show() : modal.hide()
      }}
    >
      <DialogContent
        className="max-w-md"
        aria-describedby={undefined}
        onCloseAutoFocus={() => {
          modal.remove()
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
                    <PasswordInput {...field} />
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
                <span className={cn(form.formState.isSubmitting && 'invisible')}>Save</span>
                {form.formState.isSubmitting && <Spinner className="absolute" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
