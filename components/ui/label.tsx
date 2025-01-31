'use client'

import { cn } from '@/lib/utils'

function Label({ className, htmlFor, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      htmlFor={htmlFor}
      aria-label={props['aria-label']}
      className={cn(
        'text-foreground text-sm leading-4 font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
