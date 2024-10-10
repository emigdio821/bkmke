'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import type { NavMenu } from '@/types'
import { IconChevronRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '../ui/badge'
import { NavItem } from './nav-item'

export function CollapsibleNavItem({ ...props }: NavMenu) {
  const { icon: Icon, label, href, active, submenus, actions, itemCount } = props
  const isSubmenuActive = useCallback((subs: NavMenu[]) => {
    const isActive = subs.some((sub) => {
      if (sub.active) return true

      if (sub.submenus.length > 0) {
        return isSubmenuActive(sub.submenus)
      }

      return false
    })

    return isActive
  }, [])

  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive(submenus))

  return (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
      <div className="flex items-center justify-between space-x-1">
        <CollapsibleTrigger
          className="[&[data-state=open]>div>span.chevron>svg]:rotate-90"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsCollapsed((prev) => !prev)
          }}
          asChild
        >
          <Button
            variant="nav"
            className={cn('block flex-auto overflow-hidden', {
              'bg-primary text-primary-foreground shadow-sm hover:bg-primary': active,
            })}
            onClick={(e) => {
              e.stopPropagation()
            }}
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

              {href ? (
                <Button asChild variant="link" className="block truncate text-foreground">
                  <Link
                    href={href}
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    {label}
                  </Link>
                </Button>
              ) : (
                <span className="truncate">{label}</span>
              )}
              {typeof itemCount === 'number' && itemCount > 0 && (
                <Badge
                  variant="outline"
                  className={cn('ml-2 bg-background px-1.5 py-px', {
                    'border-background shadow-sm': active,
                  })}
                >
                  {itemCount}
                </Badge>
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        {actions && <span>{actions}</span>}
      </div>
      <CollapsibleContent className="space-y-1 py-1 pl-4">
        <NavItem menus={submenus} />
      </CollapsibleContent>
    </Collapsible>
  )
}
