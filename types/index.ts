import type { TablerIcon } from '@tabler/icons-react'
import type { Tables } from './database.types'

export interface NavMenu {
  href?: string
  label: string
  active: boolean
  icon?: TablerIcon
  submenus: NavMenu[]
  withItemCount?: boolean
  actions?: React.ReactNode
}

export interface TagItem {
  id: number
  tag: {
    id: number
    name: string
  } | null
}

type FolderItem = {
  name: string
} | null

export type Bookmark = Tables<'bookmarks'> & {
  tag_items: TagItem[]
  folder: FolderItem
}

export interface OGInfo {
  title: string
  imageUrl: string
  faviconUrl: string
  description: string
}

export type BkOGInfo = Omit<OGInfo, 'title' | 'description'>

export type GenericFn<T> = (...args: never[]) => T | Promise<T>
