'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, DotIcon, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface Submenu {
  href: string
  label: string
  active: boolean
  icon?: LucideIcon
}

interface CollapseMenuButtonProps {
  icon: LucideIcon
  label: string
  active: boolean
  submenus: Submenu[]
}

export function CollapsibleMenuButton({ icon: Icon, label, active, submenus }: CollapseMenuButtonProps) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive)

  return (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
      <CollapsibleTrigger className="[&[data-state=open]>div>div>svg]:rotate-180" asChild>
        <Button
          variant="ghost"
          className={cn('w-full justify-start', {
            'bg-accent': active,
          })}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">
                <Icon className="size-4" />
              </span>
              <p className="max-w-[150px] truncate">{label}</p>
            </div>
            <div className="whitespace-nowrap">
              <ChevronDownIcon className="size-4" />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 py-1 pl-4">
        {submenus.map(({ href, label, active, icon: Icon }) => (
          <Button
            asChild
            key={href}
            variant="ghost"
            className={cn('w-full justify-start', {
              'cursor-default bg-accent': active,
            })}
          >
            <Link href={href}>
              <span className="ml-2 mr-2">{Icon ? <Icon className="size-4" /> : <DotIcon className="size-4" />}</span>
              <p className="max-w-[170px] truncate">{label}</p>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
