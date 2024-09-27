'use client'

import { usePathname } from 'next/navigation'
import { IconBookmarks } from '@tabler/icons-react'
import { FoldersNavItems } from '@/components/folders/nav-items'
import { TagsNavItems } from '@/components/tags/nav-items'
import { UserProfileDropdown } from '@/components/user-profile-dropdown'
import { NavItem } from './nav-item'

export function NavContent() {
  const pathname = usePathname()

  return (
    <nav className="h-full w-full overflow-auto">
      <ul className="flex h-full flex-col items-start space-y-1">
        <li className="w-full space-y-2 px-4 pt-4">
          <NavItem
            menus={[
              {
                href: '/',
                label: 'Bookmarks',
                active: pathname === '/',
                icon: IconBookmarks,
                submenus: [],
              },
            ]}
          />
        </li>
        <li className="w-full px-4">
          <FoldersNavItems />
        </li>
        <li className="w-full px-4">
          <TagsNavItems />
        </li>
        <li className="flex w-full grow flex-col justify-end px-4 pb-4 pt-8">
          <UserProfileDropdown />
        </li>
      </ul>
    </nav>
  )
}
