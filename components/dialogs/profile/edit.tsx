'use client'

import { useRef } from 'react'
import type { UserMetadata } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@supabase/auth-js'
import { IconUser } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { PROFILE_QUERY } from '@/lib/constants'
import { editUserSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Spinner } from '@/components/spinner'

export const EditDialog = NiceModal.create(({ user }: { user: User }) => {
  const modal = useModal()
  const supabase = createClient()
  const queryClient = useQueryClient()
  const userMetadata = user.user_metadata
  const formRef = useRef<HTMLFormElement>(null)
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: userMetadata?.name || '',
      avatar: userMetadata?.avatar || '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof editUserSchema>) {
    const metadata = {
      name: values.name,
      avatar: values.avatar,
      profile_updated_at: new Date().toString(),
    } satisfies UserMetadata

    const { error } = await supabase.auth.updateUser({
      password: values.password || undefined,
      data: metadata,
    })

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY] })
    toast.success('Success', { description: 'Profile has been updated.' })
    await modal.hide()
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
        onCloseAutoFocus={() => modal.remove()}
        className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5"
      >
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">Edit profile</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Make changes to your profile here.</DialogDescription>
        <div className="overflow-y-auto">
          <div className="px-6 pb-6 pt-4">
            <Avatar className="mb-2 size-16">
              <AvatarImage src={form.getValues('avatar') || userMetadata?.avatar} />
              <AvatarFallback>
                <IconUser size={14} />
              </AvatarFallback>
            </Avatar>
            <Form {...form}>
              <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
              </form>
            </Form>
          </div>
        </div>
        <DialogFooter className="border-t border-border px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" disabled={form.formState.isSubmitting} onClick={() => form.handleSubmit(onSubmit)()}>
            <span className={cn(form.formState.isSubmitting && 'invisible')}>Save</span>
            {form.formState.isSubmitting && <Spinner className="absolute" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
