import { zodResolver } from '@hookform/resolvers/zod'
import { OctagonAlertIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputPassword } from '@/components/ui/input-password'
import { authClient } from '@/lib/auth/client'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/lib/constants'
import { LoaderIcon } from '../icons'
import { Form } from '../ui/form'

const loginSchema = z.object({
  email: z.email().min(1, 'Email is required'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `Password must be less than ${PASSWORD_MAX_LENGTH} characters`),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginFormCard() {
  const loginFormId = useId()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    setLoading(true)
    setError('')

    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: '/',
      })

      if (error) {
        setLoading(false)
        console.error('login error:', error)

        setError(
          error.status === 401
            ? 'Invalid credentials, try again.'
            : 'An unexpected error occurred, please try again later.',
        )
      }
    } catch {
      setLoading(false)
      setError('An unexpected error occurred, please try again later.')
    }
  }

  return (
    <Card>
      <CardContent>
        <Form
          id={loginFormId}
          aria-label="Login form"
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Correo <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="email"
                  disabled={isLoading}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError match={!!fieldState.error}>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Contraseña <span className="text-destructive">*</span>
                </FieldLabel>
                <InputPassword
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading}
                />
                <FieldError match={!!fieldState.error}>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          {error && (
            <Alert variant="error">
              <OctagonAlertIcon className="size-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </Form>
      </CardContent>

      <CardFooter className="pt-4 text-center">
        <Button type="submit" form={loginFormId} className="w-full" disabled={isLoading}>
          {isLoading && <LoaderIcon />}
          Login
        </Button>
      </CardFooter>
    </Card>
  )
}
