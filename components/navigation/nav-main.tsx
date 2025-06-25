import { usePathname } from 'next/navigation'
import { BookmarkIcon, HeartIcon } from 'lucide-react'
import { useNavItemsCount } from '@/hooks/use-nav-items-count'
import { NavItem } from './nav-item'

export function NavMain() {
  const pathname = usePathname()
  const { data: navItemsCount } = useNavItemsCount()

  return (
    <div className="w-full px-4 pt-4">
      <div className="w-full space-y-1 border-b border-dashed pb-4">
        <NavItem
          menus={[
            {
              href: '/favorites',
              label: 'Favorites',
              active: pathname === '/favorites',
              icon: HeartIcon,
              itemCount: navItemsCount?.favoritesCount,
              submenus: [],
            },
          ]}
        />

        <NavItem
          menus={[
            {
              href: '/',
              label: 'Bookmarks',
              active: pathname === '/',
              icon: BookmarkIcon,
              itemCount: navItemsCount?.bookmarksCount,
              submenus: [],
            },
          ]}
        />
      </div>
    </div>
  )
}
