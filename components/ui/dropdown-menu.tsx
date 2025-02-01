'use client'

import * as React from 'react'
import { IconCheck, IconChevronRight, IconPoint } from '@tabler/icons-react'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

type PointerDownEvent = Parameters<NonNullable<DropdownMenuPrimitive.DropdownMenuContentProps['onPointerDown']>>[0]
type PointerDownOutsideEvent = Parameters<
  NonNullable<DropdownMenuPrimitive.DropdownMenuContentProps['onPointerDownOutside']>
>[0]

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

interface DropdownMenuSubtriggerProps extends DropdownMenuPrimitive.DropdownMenuSubTriggerProps {
  inset?: boolean
}

const DropdownMenuSubTrigger = ({ className, inset, children, ...props }: DropdownMenuSubtriggerProps) => (
  <DropdownMenuPrimitive.SubTrigger
    className={cn(
      'focus:bg-accent data-[state=open]:bg-accent flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <IconChevronRight className="text-muted-foreground ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
)
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = ({ className, ...props }: DropdownMenuPrimitive.DropdownMenuSubContentProps) => (
  <DropdownMenuPrimitive.SubContent
    className={cn(
      'border-border bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-40 overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5',
      className,
    )}
    {...props}
  />
)
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  onPointerDown,
  onPointerDownOutside,
  onCloseAutoFocus,
  ...props
}: DropdownMenuPrimitive.DropdownMenuContentProps) => {
  const isCloseFromMouse = React.useRef<boolean>(false)

  const handlePointerDown = React.useCallback(
    (e: PointerDownEvent) => {
      isCloseFromMouse.current = true
      onPointerDown?.(e)
    },
    [onPointerDown],
  )

  const handlePointerDownOutside = React.useCallback(
    (e: PointerDownOutsideEvent) => {
      isCloseFromMouse.current = true
      onPointerDownOutside?.(e)
    },
    [onPointerDownOutside],
  )

  const handleCloseAutoFocus = React.useCallback(
    (e: Event) => {
      if (onCloseAutoFocus) {
        return onCloseAutoFocus(e)
      }

      if (!isCloseFromMouse.current) {
        return
      }

      e.preventDefault()
      isCloseFromMouse.current = false
    },
    [onCloseAutoFocus],
  )

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'border-border bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-40 overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5',
          className,
        )}
        onPointerDown={handlePointerDown}
        onPointerDownOutside={handlePointerDownOutside}
        onCloseAutoFocus={handleCloseAutoFocus}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

interface DropdownMenuItemProps extends DropdownMenuPrimitive.DropdownMenuItemProps {
  inset?: boolean
}

const DropdownMenuItem = ({ className, inset, ...props }: DropdownMenuItemProps) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
)
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: DropdownMenuPrimitive.DropdownMenuCheckboxItemProps) => (
  <DropdownMenuPrimitive.CheckboxItem
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <IconCheck className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
)
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = ({ className, children, ...props }: DropdownMenuPrimitive.DropdownMenuRadioItemProps) => (
  <DropdownMenuPrimitive.RadioItem
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <IconPoint className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
)
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

interface DropdownMenuLabelProps extends DropdownMenuPrimitive.DropdownMenuLabelProps {
  inset?: boolean
}

const DropdownMenuLabel = ({ className, inset, ...props }: DropdownMenuLabelProps) => (
  <DropdownMenuPrimitive.Label
    className={cn('text-muted-foreground px-2 py-1.5 text-xs font-medium', inset && 'pl-8', className)}
    {...props}
  />
)
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = ({ className, ...props }: DropdownMenuPrimitive.DropdownMenuSeparatorProps) => (
  <DropdownMenuPrimitive.Separator className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />
)
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'border-border bg-background text-muted-foreground ms-auto -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium',
        className,
      )}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
