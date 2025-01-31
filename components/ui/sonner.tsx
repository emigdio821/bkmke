'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'
import { buttonVariants } from './button'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'bg-background flex w-(--width) items-center gap-2 rounded-md border p-4 font-sans text-sm shadow-xs',
          description: '!text-muted-foreground',
          actionButton: buttonVariants({ size: 'sm' }),
          cancelButton: buttonVariants({ variant: 'outline', size: 'sm' }),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
