'use client'

import { Popover as PopoverPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

interface PopoverContentProps extends PopoverPrimitive.PopoverContentProps {
  showArrow?: boolean
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  showArrow = false,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'border-border bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-[var(--radix-popover-content-available-height)] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-4 shadow-lg shadow-black/5 outline-hidden',
          className,
        )}
        {...props}
      >
        {props.children}
        {showArrow && (
          <PopoverPrimitive.Arrow className="fill-popover -my-px drop-shadow-[0_1px_0_hsl(var(--border))]" />
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }
