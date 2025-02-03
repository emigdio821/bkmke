'use client'

import { useRef } from 'react'
import type { UserProfile } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Spinner } from '@/components/spinner'

export const EditDialog = NiceModal.create(({ user }: { user: UserProfile }) => {
  const modal = useModal()
  const supabase = createClient()
  const queryClient = useQueryClient()
  const formRef = useRef<HTMLFormElement>(null)
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: user.first_name ?? '',
      lastName: user.last_name ?? '',
      avatarUrl: user.avatar_url ?? '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof editUserSchema>) {
    if (values.password) {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (error) {
        toast.error('Error', { description: error.message })
        return
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: values.firstName,
        last_name: values.lastName,
        avatar_url: values.avatarUrl,
      })
      .eq('id', user.id)

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
      <DialogContent side="right" onCloseAutoFocus={() => modal.remove()} className="sm:max-w-sm">
        <DialogHeader className="space-y-0">
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Make changes to your profile here.</DialogDescription>
        <div className="overflow-y-auto p-4">
          <Avatar className="mb-4 size-16">
            <AvatarImage src={form.getValues('avatarUrl') || user.avatar_url || ''} />
            <AvatarFallback>
              <IconUser size={14} />
            </AvatarFallback>
          </Avatar>
          <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="avatarUrl"
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
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
