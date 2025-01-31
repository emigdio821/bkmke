'use client'

import { Tabs as TabsPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List
    className={cn('bg-muted text-muted-foreground inline-flex items-center justify-center rounded-md p-1', className)}
    {...props}
  />
)
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      'outline-ring hover:text-muted-foreground focus-visible:outline-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center rounded-sm px-3 py-1 text-sm font-medium whitespace-nowrap outline-hidden outline-offset-2 transition-colors focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-xs data-[state=active]:shadow-black/5',
      className,
    )}
    {...props}
  />
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = ({ className, ...props }: TabsPrimitive.TabsContentProps) => (
  <TabsPrimitive.Content
    className={cn('focus-visible:outline-ring/70 mt-4 outline-offset-2 focus-visible:outline-2', className)}
    {...props}
  />
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
