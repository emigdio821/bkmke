'use client'

import { Progress as ProgressPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

function Progress({ className, value, ...props }: ProgressPrimitive.ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn('bg-primary/20 relative h-1 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
