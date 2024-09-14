import type { LucideIcon } from 'lucide-react'

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
