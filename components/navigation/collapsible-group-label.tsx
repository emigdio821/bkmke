'use client'

import { useState } from 'react'
import { ChevronDownIcon, MoreHorizontal, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface CollapseMenuButtonProps {
  groupIcon?: LucideIcon
  groupLabel?: string
  children?: React.ReactNode
  itemCount: number
  isActive: boolean
}

export function CollapsibleGroupLabel({
  groupIcon: GroupIcon,
  groupLabel,
  itemCount,
  isActive,
  children,
}: CollapseMenuButtonProps) {
  const [isCollapsed, setIsCollapsed] = useState(isActive)

  if (!GroupIcon && !groupLabel) return null

  return (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
      <div className="flex items-center space-x-1">
        <CollapsibleTrigger className="[&[data-state=open]>div>div>svg]:rotate-180" asChild>
          <Button variant="link" className="h-9 w-full justify-start px-4 py-2 text-foreground">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                {GroupIcon && (
                  <span className="mr-2">
                    <GroupIcon className="size-4" />
                  </span>
                )}
                {groupLabel && (
                  <>
                    <span className="max-w-20 truncate">{groupLabel}</span>
                    <span className="ml-1 text-xs text-muted-foreground">({itemCount})</span>
                  </>
                )}
              </div>
              <div className="whitespace-nowrap">
                <ChevronDownIcon className="size-4" />
              </div>
            </div>
          </Button>
        </CollapsibleTrigger>
        <Button size="icon" className="h-6" variant="ghost">
          <span className="sr-only">Open group actions</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </div>

      {children && <CollapsibleContent className="space-y-1 py-1 pl-4">{children}</CollapsibleContent>}
    </Collapsible>
  )
}
