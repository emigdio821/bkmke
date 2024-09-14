import type { Menu } from '@/types'
import { Button } from '../ui/button'
import { CollapsibleMenuButton } from './collapssible-menu-btn'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function SubMenu({ menus }: { menus: Menu[] }) {
  return (
    <>
      {menus.map(({ href, label, icon: Icon, active, submenus }) =>
        submenus.length === 0 ? (
          <div className="w-full" key={href}>
            <Button
              asChild
              variant="ghost"
              className={cn('w-full justify-start', {
                'bg-accent cursor-default': active,
              })}
            >
              <Link href={href}>
                <span className="mr-2">
                  <Icon className="size-4" />
                </span>
                <p className="max-w-[200px] truncate">{label}</p>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="w-full" key={href}>
            <CollapsibleMenuButton icon={Icon} label={label} active={active} submenus={submenus} />
          </div>
        ),
      )}
    </>
  )
}
