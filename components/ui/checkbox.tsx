import { IconCheck, IconMinus } from '@tabler/icons-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const Checkbox = ({ className, ...props }: CheckboxPrimitive.CheckboxProps) => (
  <CheckboxPrimitive.Root
    className={cn(
      'focus-visible:outline-ring bg-background data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground inline-flex size-4 items-center justify-center rounded-sm border outline-hidden focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      {props.checked === 'indeterminate' ? <IconMinus className="size-3.5" /> : <IconCheck className="size-3.5" />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
