'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookmarkIcon, HeartIcon } from 'lucide-react'
import { useNavItemsCount } from '@/hooks/use-nav-items-count'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavFolders } from './navs/folders/nav-folders'
import { NavTags } from './navs/nav-tags'
import { NavUser } from './navs/nav-user'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: navItemsCount } = useNavItemsCount()
  const favsCount = navItemsCount?.favoritesCount
  const bksCount = navItemsCount?.bookmarksCount

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  bk
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">bkmke</span>
                  <span className="truncate text-xs">Bookmark manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === '/favorites'} asChild>
              <Link href="/favorites">
                <HeartIcon className="size-4" />
                <span>Favorites</span>
              </Link>
            </SidebarMenuButton>
            {favsCount && <SidebarMenuBadge>{favsCount}</SidebarMenuBadge>}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === '/'} asChild>
              <Link href="/">
                <BookmarkIcon className="size-4" />
                <span>Bookmarks</span>
              </Link>
            </SidebarMenuButton>
            {bksCount && <SidebarMenuBadge>{bksCount}</SidebarMenuBadge>}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavFolders />
        <NavTags />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
