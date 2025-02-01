'use client'

import { IconCheck, IconMinus } from '@tabler/icons-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const Checkbox = ({ className, ...props }: CheckboxPrimitive.CheckboxProps) => (
  <CheckboxPrimitive.Root
    className={cn(
      'peer outline-ring bg-background border-input focus-visible:outline-ring/70 data-[state=checked]:border-primary data-[state=indeterminate]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:text-primary-foreground grid size-4 shrink-0 place-content-center rounded border shadow-sm shadow-black/5 outline-offset-2 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="grid place-content-center text-current">
      {props.checked === 'indeterminate' ? (
        <IconMinus size={16} strokeWidth={2} />
      ) : (
        <IconCheck size={16} strokeWidth={2} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
