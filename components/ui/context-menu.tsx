'use client'

import { IconCheck, IconChevronRight, IconPoint } from '@tabler/icons-react'
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

interface ContextMenuSubTriggerProps extends ContextMenuPrimitive.ContextMenuSubTriggerProps {
  inset?: boolean
}

const ContextMenuSubTrigger = ({ className, inset, children, ...props }: ContextMenuSubTriggerProps) => (
  <ContextMenuPrimitive.SubTrigger
    className={cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <IconChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
)
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = ({ className, ...props }: ContextMenuPrimitive.ContextMenuSubContentProps) => (
  <ContextMenuPrimitive.SubContent
    className={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
      className,
    )}
    {...props}
  />
)
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = ({ className, ...props }: ContextMenuPrimitive.ContextMenuContentProps) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md',
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
)
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

interface ContextMenuItemProps extends ContextMenuPrimitive.ContextMenuItemProps {
  inset?: boolean
}

const ContextMenuItem = ({ className, inset, ...props }: ContextMenuItemProps) => (
  <ContextMenuPrimitive.Item
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
)
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: ContextMenuPrimitive.ContextMenuCheckboxItemProps) => (
  <ContextMenuPrimitive.CheckboxItem
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <IconCheck className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
)
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = ({ className, children, ...props }: ContextMenuPrimitive.ContextMenuRadioItemProps) => (
  <ContextMenuPrimitive.RadioItem
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <IconPoint className="h-4 w-4 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
)
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

interface ContextMenuLabelProps extends ContextMenuPrimitive.ContextMenuLabelProps {
  inset?: boolean
}

const ContextMenuLabel = ({ className, inset, ...props }: ContextMenuLabelProps) => (
  <ContextMenuPrimitive.Label
    className={cn('text-foreground px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...props}
  />
)
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = ({ className, ...props }: ContextMenuPrimitive.ContextMenuSeparatorProps) => (
  <ContextMenuPrimitive.Separator className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />
)
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)} {...props} />
}
ContextMenuShortcut.displayName = 'ContextMenuShortcut'

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
