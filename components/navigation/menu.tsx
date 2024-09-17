'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Group, Menu as GroupMenu } from '@/types'
import { BookmarkIcon, FolderIcon, FoldersIcon, HashIcon, TagIcon } from 'lucide-react'
import { useFolders } from '@/hooks/use-folders'
import { useTags } from '@/hooks/use-tags'
import { SidebarSkeleton } from '@/components/skeletons'
import { UserProfileDropdown } from '@/components/user-profile-dropdown'
import { CollapsibleGroupLabel } from './collapsible-group-label'
import { SubMenu } from './sub-menu'

export function Menu() {
  const pathname = usePathname()
  const { data: folders, isLoading: foldersLoading } = useFolders()
  const { data: tags, isLoading: tagsLoading } = useTags()
  const [menuList, setMenuList] = useState<Group[]>([])

  const generateMenuList = useCallback(() => {
    const foldersMenu: GroupMenu[] =
      folders?.map((folder) => ({
        href: `/folders/${folder.id}`,
        label: folder.name,
        active: pathname.includes(`/folders/${folder.id}`),
        icon: FolderIcon,
        submenus: [],
      })) || []

    const tagsMenu: GroupMenu[] =
      tags?.map((tag) => ({
        href: `/tags/${tag.id}`,
        label: tag.name,
        active: pathname.includes(`/tags/${tag.id}`),
        icon: HashIcon,
        submenus: [],
      })) || []

    const menus: Group[] = [
      {
        id: 'my-bookmarks-link',
        menus: [
          {
            href: '/bookmarks',
            label: 'Bookmarks',
            active: pathname === '/bookmarks',
            icon: BookmarkIcon,
            submenus: [],
          },
        ],
      },
      { id: 'folders-menu', groupLabel: 'Folders', groupIcon: FoldersIcon, menus: foldersMenu },
      { id: 'tags-menu', groupLabel: 'Tags', groupIcon: TagIcon, menus: tagsMenu },
    ]

    return menus
  }, [folders, tags, pathname])

  useEffect(() => {
    setMenuList(generateMenuList())
  }, [generateMenuList])

  if (foldersLoading || tagsLoading) return <SidebarSkeleton />

  return (
    <nav className="my-2 h-full w-full overflow-y-auto px-4 py-2">
      <ul className="flex h-full flex-col items-start space-y-1">
        {menuList.map(({ id, groupLabel, groupIcon: GroupIcon, menus }) => (
          <li className="w-full space-y-2" key={id}>
            {GroupIcon || groupLabel ? (
              <CollapsibleGroupLabel groupIcon={GroupIcon} groupLabel={groupLabel} itemCount={menus.length}>
                <SubMenu menus={menus} />
              </CollapsibleGroupLabel>
            ) : (
              <SubMenu menus={menus} />
            )}
          </li>
        ))}
        <li className="flex w-full grow flex-col justify-end pt-4">
          <UserProfileDropdown />
        </li>
      </ul>
    </nav>
  )
}
