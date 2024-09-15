import type { Group } from '@/types'
import { BookmarkIcon, FolderIcon, FoldersIcon, HashIcon, TagIcon } from 'lucide-react'

export function getMenuList(pathname: string): Group[] {
  return [
    {
      id: '1',
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
    {
      id: '2',
      groupLabel: 'Folders',
      groupIcon: FoldersIcon,
      menus: [
        {
          href: '/folders/1',
          label: 'Folder 1',
          active: pathname.includes('/folders/1'),
          icon: FolderIcon,
          submenus: [],
        },
        {
          href: '/folders/2',
          label: 'Folder 2',
          active: pathname.includes('/folders/2'),
          icon: FolderIcon,
          submenus: [],
        },
        {
          href: '/folders/3',
          label: 'Folder 3',
          active: pathname.includes('/folders/3'),
          icon: FolderIcon,
          submenus: [],
        },
      ],
    },
    {
      id: '3',
      groupLabel: 'Tags',
      groupIcon: TagIcon,
      menus: [
        {
          href: '/folders/1',
          label: 'dev',
          active: pathname.includes('/products'),
          icon: HashIcon,
          submenus: [],
        },
        {
          href: '/folders/2',
          label: 'anime',
          active: pathname.includes('/categories'),
          icon: HashIcon,
          submenus: [],
        },
      ],
    },
  ]
}
