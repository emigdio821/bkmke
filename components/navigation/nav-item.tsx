import type { NavMenu } from '@/types'
import { CollapsibleNavItem } from './collapsible-nav-item'
import { SimpleNavItem } from './simple-nav-item'

export function NavItem({ menus }: { menus: NavMenu[] }) {
  return (
    <>
      {menus.map(({ ...props }) =>
        props.submenus.length === 0 ? (
          <SimpleNavItem key={`${props.href}-${props.label}`} {...props} />
        ) : (
          <CollapsibleNavItem key={`${props.href}-${props.label}`} {...props} />
        ),
      )}
    </>
  )
}
