'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { NavMenu } from '@/types'
import { IconChevronRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { NavItem } from './nav-item'

export function CollapsibleNavItem({ ...props }: NavMenu) {
  const { withItemCount, icon: Icon, label, href, active, submenus, actions } = props
  const isSubmenuActive = submenus.some((submenu) => submenu.active)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive)

  return (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
      <div className="flex items-center justify-between space-x-1">
        {!href ? (
          <>
            <CollapsibleTrigger className="[&[data-state=open]>div>span.chevron>svg]:rotate-90" asChild>
              <Button
                variant="ghost"
                className={cn('block flex-auto overflow-hidden', {
                  'bg-accent': active,
                })}
              >
                <div className="flex items-center">
                  <span className="chevron mr-2">
                    <IconChevronRight className="size-4" />
                  </span>
                  {Icon && (
                    <span className="mr-2">
                      <Icon className="size-4" />
                    </span>
                  )}
                  <span className="truncate">{label}</span>
                  {withItemCount && submenus.length > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">({submenus.length})</span>
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            {actions && <span>{actions}</span>}
          </>
        ) : (
          <>
            <CollapsibleTrigger className="[&[data-state=open]>svg]:rotate-90" asChild>
              <Button variant="ghost" size="icon">
                <IconChevronRight className="size-4" />
                <span className="sr-only">Toggle collapsible item</span>
              </Button>
            </CollapsibleTrigger>
            <Button
              asChild
              variant="ghost"
              className={cn('block flex-auto overflow-hidden', {
                'bg-accent': active,
              })}
            >
              <Link href={href}>
                <div className="flex items-center">
                  {Icon && (
                    <span className="mr-2">
                      <Icon className="size-4" />
                    </span>
                  )}
                  <span className="truncate">{label}</span>
                  {withItemCount && submenus.length > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">({submenus.length})</span>
                  )}
                </div>
              </Link>
            </Button>
            {actions && <span>{actions}</span>}
          </>
        )}
      </div>
      <CollapsibleContent className="space-y-1 py-1 pl-4">
        <NavItem menus={submenus} />
      </CollapsibleContent>
    </Collapsible>
  )
}
