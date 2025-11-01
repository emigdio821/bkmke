'use client'

import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginSchema } from '@/lib/schemas/form'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword(values)

    if (error) {
      toast.error('Error', { description: error.message })
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <>
      <CardContent>
        <Form {...form}>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
      </CardContent>
      <CardFooter>
        <Button type="submit" form="login-form" className="w-full" disabled={isLoading}>
          <span className={cn(isLoading && 'invisible')}>Log in</span>
          {isLoading && <Spinner className="absolute" />}
        </Button>
      </CardFooter>
    </>
  )
}
