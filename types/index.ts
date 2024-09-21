import type { LucideIcon } from 'lucide-react'
import type { Tables } from './database.types'

export interface NavMenu {
  href?: string
  label: string
  active: boolean
  icon?: LucideIcon
  submenus: NavMenu[]
  withItemCount?: boolean
  actions?: React.ReactNode
}

export interface TagItem {
  id: number
  tags: {
    id: number
    name: string
  } | null
}

type FolderItem = {
  name: string
} | null

export type Bookmark = Tables<'bookmarks'> & {
  tag_items: TagItem[]
  folders: FolderItem
}

export interface OGInfo {
  title: string
  imageUrl: string
  faviconUrl: string
  description: string
}
