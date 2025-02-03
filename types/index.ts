import type { TablerIcon } from '@tabler/icons-react'
import type { Tables } from './database.types'

export interface NavMenu {
  href?: string
  label: string
  active: boolean
  icon?: TablerIcon
  submenus: NavMenu[]
  itemCount?: number
  actions?: React.ReactNode
}

export interface TagItem {
  id: string
  tag: {
    id: string
    name: string
  } | null
}

type FolderItem = {
  name: string
} | null

export interface Bookmark extends Tables<'bookmarks'> {
  tag_items: TagItem[]
  folder: FolderItem
}

export interface Folder extends Tables<'folders'> {
  children: Folder[]
  items: { count: number }[]
}

export interface OGInfo {
  title: string
  imageUrl: string
  faviconUrl: string
  description: string
}

export type BkOGInfo = Omit<OGInfo, 'title' | 'description'>
export type GenericFn<T> = (...args: never[]) => T | Promise<T>
export type TableLayout = 'table' | 'masonry'

export interface UserProfile extends Tables<'profiles'> {
  email?: string
  user_role: Tables<'role_permissions'>['role'] | null
}
