import type { NavMenu } from '@/types'
import { ItemCount } from './item-count'
import { NavItemContent } from './nav-item-content'

export function SimpleNavItem(props: NavMenu) {
  const { href, icon: Icon, active, label, actions, itemCount } = props

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
          {typeof itemCount === 'number' && itemCount > 0 && <ItemCount count={itemCount} />}
        </div>
      </NavItemContent>
      {actions && <span>{actions}</span>}
    </div>
  )
}
