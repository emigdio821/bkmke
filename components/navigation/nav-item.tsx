import Link from 'next/link'
import type { Menu } from '@/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CollapsibleMenuButton } from './collapssible-menu-btn'

export function NavItem({ menus }: { menus: Menu[] }) {
  return (
    <>
      {menus.map(({ href, label, icon: Icon, active, submenus }) =>
        submenus.length === 0 ? (
          <div className="w-full" key={href}>
            <Button
              asChild
              variant="link"
              className={cn('h-9 w-full justify-start px-4 py-2 text-foreground', {
                'cursor-default bg-accent hover:no-underline': active,
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
