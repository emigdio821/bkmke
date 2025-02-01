'use client'

import { Avatar as AvatarPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const Avatar = ({ className, ...props }: AvatarPrimitive.AvatarProps) => (
  <AvatarPrimitive.Root
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
)
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = ({ className, ...props }: AvatarPrimitive.AvatarImageProps) => (
  <AvatarPrimitive.Image className={cn('aspect-square h-full w-full object-cover', className)} {...props} />
)
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = ({ className, ...props }: AvatarPrimitive.AvatarFallbackProps) => (
  <AvatarPrimitive.Fallback
    className={cn('bg-secondary flex h-full w-full items-center justify-center rounded-[inherit] text-xs', className)}
    {...props}
  />
)
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarFallback, AvatarImage }
