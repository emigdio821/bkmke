import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Folder } from '@/types'
import { ChevronRightIcon, FolderIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { NavFolderActions } from './nav-folder-actions'

interface FolderItemProps {
  folder: Folder
}

export function NavFolderItem({ folder }: FolderItemProps) {
  const pathname = usePathname()
  const isActive = pathname === `/folders/${folder.id}`

  if (folder.children.length > 0) {
    return (
      <Collapsible key={folder.id} defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuAction
              showOnHover
              aria-label="collapse/expand"
              className={cn(
                'bg-sidebar-accent left-1.5 data-[state=open]:rotate-90',
                isActive && 'hover:bg-highlight data-[state=open]:hover:bg-highlight',
              )}
            >
              <ChevronRightIcon />
            </SidebarMenuAction>
          </CollapsibleTrigger>

          <SidebarMenuButton
            asChild
            isActive={isActive}
            className={cn(folder.items[0].count > 0 && 'group-has-data-[sidebar=menu-action]/menu-item:pr-16')}
          >
            <Link href={`/folders/${folder.id}`}>
              <FolderIcon className="size-4" />
              <span>{folder.name}</span>
            </Link>
          </SidebarMenuButton>

          {folder.items[0].count > 0 && (
            <SidebarMenuBadge className="right-8">{folder.items[0].count}</SidebarMenuBadge>
          )}
          <NavFolderActions folder={folder} />
        </SidebarMenuItem>

        <CollapsibleContent asChild>
          <SidebarMenuSub>
            {folder.children.map((child) =>
              child.children.length > 0 ? (
                <div key={child.id}>
                  <NavFolderItem folder={child} />
                </div>
              ) : (
                <SidebarMenuSubItem key={child.id}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === `/folders/${child.id}`}
                    className={cn(folder.items[0].count > 0 && 'group-has-data-[sidebar=menu-action]/menu-item:pr-16')}
                  >
                    <Link href={`/folders/${child.id}`}>
                      <span>{child.name}</span>
                    </Link>
                  </SidebarMenuSubButton>

                  {child.items[0].count > 0 && (
                    <SidebarMenuBadge className="top-1 right-8">{child.items[0].count}</SidebarMenuBadge>
                  )}
                  <NavFolderActions className="top-1" folder={child} />
                </SidebarMenuSubItem>
              ),
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem key={folder.id}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(folder.items[0].count > 0 && 'group-has-data-[sidebar=menu-action]/menu-item:pr-16')}
      >
        <Link href={`/folders/${folder.id}`}>
          <FolderIcon className="size-4" />
          <span>{folder.name}</span>
        </Link>
      </SidebarMenuButton>

      {folder.items[0].count > 0 && <SidebarMenuBadge className="right-8">{folder.items[0].count}</SidebarMenuBadge>}
      <NavFolderActions folder={folder} />
    </SidebarMenuItem>
  )
}
