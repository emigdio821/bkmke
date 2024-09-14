'use client'

// import { getMenuList } from '@/lib/menu-list'
// import { usePathname } from 'next/navigation'
import { CollapsibleGroupLabel } from './collapsible-group-label'
import { SubMenu } from './sub-menu'
import { UserProfileDropdown } from '@/components/user-profile-dropdown'
import { Group } from '@/types'

export function Menu({ menuList = [] }: { menuList: Group[] }) {
  // const pathname = usePathname()
  // const menuList = getMenuList(pathname)

  return (
    <nav className="h-full w-full p-4 overflow-y-auto sm:p-6">
      <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] sm:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1">
        {menuList.map(({ id, groupLabel, groupIcon: GroupIcon, menus }) => (
          <li className="w-full space-y-2" key={id}>
            {GroupIcon || groupLabel ? (
              <CollapsibleGroupLabel groupIcon={GroupIcon} groupLabel={groupLabel}>
                <SubMenu menus={menus} />
              </CollapsibleGroupLabel>
            ) : (
              <SubMenu menus={menus} />
            )}
          </li>
        ))}
        <li className="w-full pt-10 grow flex flex-col gap-1 justify-end">
          <UserProfileDropdown />
        </li>
      </ul>
    </nav>
  )
}
