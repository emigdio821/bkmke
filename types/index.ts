import type { LucideIcon } from 'lucide-react'
import type { Tables } from './database.types'

export interface Submenu {
  href: string
  label: string
  active: boolean
  icon?: LucideIcon
}

export interface Menu {
  href: string
  label: string
  active: boolean
  icon: LucideIcon
  submenus: Submenu[]
}

export interface Group {
  id: string
  groupLabel?: string
  groupIcon?: LucideIcon
  menus: Menu[]
}

export interface TagItem {
  id: number
  tags: {
    id: number
    name: string
  } | null
}

export type Bookmark = Tables<'bookmarks'> & {
  tag_items: TagItem[]
  folders: {
    name: string
  } | null
}
