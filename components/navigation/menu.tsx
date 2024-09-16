'use client'

import { usePathname } from 'next/navigation'
import type { Group } from '@/types'
import { BookmarkIcon, FolderIcon, FoldersIcon, HashIcon, TagIcon } from 'lucide-react'
import { useFolders } from '@/hooks/use-folders'
import { useTags } from '@/hooks/use-tags'
import { UserProfileDropdown } from '@/components/user-profile-dropdown'
import { CreateFolder } from '../create-folder'
import { CreateTag } from '../create-tag'
import { CollapsibleGroupLabel } from './collapsible-group-label'
import { SubMenu } from './sub-menu'

export function Menu() {
  const pathname = usePathname()
  const { data: folders } = useFolders()
  const { data: tags } = useTags()

  const menuList: Group[] = [
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
  ]

  function getFolderSubmenus() {
    const menus = []
    if (folders) {
      for (const folder of folders) {
        menus.push({
          href: `/folders/${folder.id}`,
          label: folder.name,
          active: pathname.includes(`/folders/${folder.id}`),
          icon: FolderIcon,
          submenus: [],
        })
      }
    }

    return menus
  }

  function getTagsSubmenus() {
    const menus = []
    if (tags) {
      for (const tag of tags) {
        menus.push({
          href: `/tags/${tag.id}`,
          label: tag.name,
          active: pathname.includes(`/tags/${tag.id}`),
          icon: HashIcon,
          submenus: [],
        })
      }
    }

    return menus
  }

  if (folders && folders.length > 0) {
    menuList.push({
      id: 'folders-menu',
      groupLabel: 'Folders',
      groupIcon: FoldersIcon,
      menus: getFolderSubmenus(),
    })
  }

  if (tags && tags.length > 0) {
    menuList.push({
      id: 'tags-menu',
      groupLabel: 'Tags',
      groupIcon: TagIcon,
      menus: getTagsSubmenus(),
    })
  }

  return (
    <nav className="h-full w-full overflow-y-auto p-4">
      <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 sm:min-h-[calc(100vh-32px-40px-32px)]">
        {menuList.map(({ id, groupLabel, groupIcon: GroupIcon, menus }) => (
          <li className="w-full space-y-2" key={id}>
            {GroupIcon || groupLabel ? (
              <CollapsibleGroupLabel
                groupIcon={GroupIcon}
                groupLabel={groupLabel}
                itemCount={menus.length}
              >
                <SubMenu menus={menus} />
              </CollapsibleGroupLabel>
            ) : (
              <SubMenu menus={menus} />
            )}
          </li>
        ))}
        <li className="flex w-full grow flex-col justify-end gap-1 pt-10">
          <CreateFolder />
          <CreateTag />
          <UserProfileDropdown />
        </li>
      </ul>
    </nav>
  )
}
