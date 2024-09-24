import type { NavMenu } from '@/types'
import { NavItemContent } from './nav-item-content'

export function SimpleNavItem({ ...props }: NavMenu) {
  const { href, icon: Icon, active, label, withItemCount, submenus, actions } = props

  return (
    <div className="flex w-full items-center justify-between space-x-1">
      <NavItemContent href={href} active={active}>
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
      </NavItemContent>
      {actions && <span>{actions}</span>}
    </div>
  )
}
