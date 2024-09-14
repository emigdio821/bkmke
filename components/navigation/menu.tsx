'use client'

import { usePathname } from 'next/navigation'
import { CollapsibleGroupLabel } from './collapsible-group-label'
import { SubMenu } from './sub-menu'
import { UserProfileDropdown } from '@/components/user-profile-dropdown'
import { Group } from '@/types'
import { BookmarkIcon, FolderIcon, FoldersIcon, HashIcon, TagIcon } from 'lucide-react'
import { Tables } from '@/types/database.types'
import { CreateTag } from '../create-tag'
import { CreateFolder } from '../create-folder'

interface MenuProps {
  folders: Tables<'folders'>[]
  tags: Tables<'tags'>[]
}

export function Menu({ folders, tags }: MenuProps) {
  const pathname = usePathname()

  const menuList: Group[] = [
    {
      id: 'my-bookmarks-link',
      menus: [
        {
          href: '/my-bookmarks',
          label: 'My bookmarks',
          active: pathname === '/my-bookmarks',
          icon: BookmarkIcon,
          submenus: [],
        },
      ],
    },
  ]

  function getFolderSubmenus() {
    const menus = []
    for (const folder of folders) {
      menus.push({
        href: `/folders/${folder.id}`,
        label: folder.name,
        active: pathname.includes(`/folders/${folder.id}`),
        icon: FolderIcon,
        submenus: [],
      })
    }

    return menus
  }

  function getTagsSubmenus() {
    const menus = []
    for (const tag of tags) {
      menus.push({
        href: `/tags/${tag.id}`,
        label: tag.name,
        active: pathname.includes(`/tags/${tag.id}`),
        icon: HashIcon,
        submenus: [],
      })
    }

    return menus
  }

  if (folders.length > 0) {
    menuList.push({
      id: 'folders-menu',
      groupLabel: 'Folders',
      groupIcon: FoldersIcon,
      menus: getFolderSubmenus(),
    })
  }

  if (tags.length > 0) {
    menuList.push({
      id: 'tags-menu',
      groupLabel: 'Tags',
      groupIcon: TagIcon,
      menus: getTagsSubmenus(),
    })
  }

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
          <CreateFolder />
          <CreateTag />
          <UserProfileDropdown />
        </li>
      </ul>
    </nav>
  )
}
