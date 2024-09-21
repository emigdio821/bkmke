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
    <nav className="my-2 h-full w-full overflow-auto px-4 py-2">
      <ul className="flex h-full flex-col items-start space-y-1">
        <li className="w-full space-y-2">
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
        <FoldersNavItems />
        <TagsNavItems />
        <li className="flex w-full grow flex-col justify-end pt-4">
          <UserProfileDropdown />
        </li>
      </ul>
    </nav>
  )
}
