'use client'

import { useState } from 'react'
import type { UserProfile } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/spinner'

interface EditProfileDialogProps {
  profile: UserProfile
  trigger: React.ReactNode
}

export function EditProfileDialog({ profile, trigger }: EditProfileDialogProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const supabase = createClient()
  const queryClient = useQueryClient()

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
      .eq('id', profile.id)

    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY] })
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
