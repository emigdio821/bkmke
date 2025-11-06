'use client'

import type { UserProfile } from '@/types'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Spinner } from '@/components/spinner'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { editUserSchema } from '@/lib/schemas/form'
import { updateProfile } from '@/lib/server-actions/profile'
import { LOGGED_IN_USER_PROFILE_QUERY_KEY } from '@/lib/ts-queries/profile'
import { cn } from '@/lib/utils'

interface EditProfileDialogProps {
  profile: UserProfile
  trigger: React.ReactNode
}

export function EditProfileDialog({ profile, trigger }: EditProfileDialogProps) {
  const queryClient = useQueryClient()
  const [openDialog, setOpenDialog] = useState(false)

  const form = useForm<z.infer<typeof editUserSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: profile.first_name ?? '',
      lastName: profile.last_name ?? '',
      avatarUrl: profile.avatar_url ?? '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof editUserSchema>) {
    const { error } = await updateProfile(values, profile.id)

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    await queryClient.invalidateQueries({ queryKey: [LOGGED_IN_USER_PROFILE_QUERY_KEY] })

    form.reset(values)
    setOpenDialog(false)
    toast.success('Success', { description: 'Profile has been updated.' })
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
        <DialogHeader className="space-y-0">
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">Make changes to your profile here.</DialogDescription>

        <Avatar className="mb-4 size-16">
          <AvatarImage src={form.getValues('avatarUrl') || profile.avatar_url || ''} />
          <AvatarFallback />
        </Avatar>
        <Form {...form}>
          <form id="update-profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="update-profile-form" disabled={form.formState.isSubmitting}>
            <span className={cn(form.formState.isSubmitting && 'invisible')}>Save</span>
            {form.formState.isSubmitting && <Spinner className="absolute" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
