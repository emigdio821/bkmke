'use client'

import { IconCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { Select as SelectPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = ({ className, children, ...props }: SelectPrimitive.SelectTriggerProps) => (
  <SelectPrimitive.Trigger
    className={cn(
      'border-input bg-background text-foreground focus:border-ring focus:ring-ring/20 data-placeholder:text-muted-foreground flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-start text-sm shadow-xs shadow-black/5 focus:ring-[3px] focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:min-w-0',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <IconChevronDown size={16} strokeWidth={2} className="text-muted-foreground shrink-0" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = ({ className, ...props }: SelectPrimitive.SelectScrollUpButtonProps) => (
  <SelectPrimitive.ScrollUpButton
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <IconChevronUp size={16} strokeWidth={2} />
  </SelectPrimitive.ScrollUpButton>
)
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = ({ className, ...props }: SelectPrimitive.SelectScrollDownButtonProps) => (
  <SelectPrimitive.ScrollDownButton
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <IconChevronDown size={16} strokeWidth={2} />
  </SelectPrimitive.ScrollDownButton>
)
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = ({ className, children, position = 'popper', ...props }: SelectPrimitive.SelectContentProps) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn(
        'border-input bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[min(24rem,var(--radix-select-content-available-height))] min-w-[8rem] overflow-hidden rounded-md border shadow-lg shadow-black/5 [&_[role=group]]:py-1',
        position === 'popper' &&
          'w-full min-w-[var(--radix-select-trigger-width)] data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)]')}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
)
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = ({ className, ...props }: SelectPrimitive.SelectLabelProps) => (
  <SelectPrimitive.Label
    className={cn('text-muted-foreground py-1.5 ps-8 pe-2 text-xs font-medium', className)}
    {...props}
  />
)
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = ({ className, children, ...props }: SelectPrimitive.SelectItemProps) => (
  <SelectPrimitive.Item
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 ps-8 pe-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute start-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <IconCheck size={16} strokeWidth={2} />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = ({ className, ...props }: SelectPrimitive.SelectSeparatorProps) => (
  <SelectPrimitive.Separator className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />
)
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
