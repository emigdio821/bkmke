'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, FolderIcon, RotateCwIcon } from 'lucide-react'
import { useFolders } from '@/hooks/folders/use-folders'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

export function NavFolders() {
  const pathname = usePathname()
  const { data: folders, isLoading, error, refetch } = useFolders()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading &&
          Array.from(Array(4).keys()).map((n) => <SidebarMenuSkeleton key={`${n}-folders-skeleton`} showIcon />)}
        {error && (
          <SidebarMenuButton onClick={() => refetch()}>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Refetch folders</span>
            </div>
            <RotateCwIcon className="ml-auto size-4" />
          </SidebarMenuButton>
        )}
        {folders?.map((folder) => (
          <Fragment key={folder.id}>
            {folder.children.length > 0 ? (
              <Collapsible
                asChild
                key={folder.id}
                defaultOpen={pathname === `/folders/${folder.id}`}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <FolderIcon className="size-4" />
                      <span>{folder.name}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {folder.children?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton isActive={pathname === `/folders/${subItem.id}`} asChild>
                            <Link href={`/folders/${subItem.id}`}>
                              <span>{subItem.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={folder.id}>
                <SidebarMenuButton isActive={pathname === `/folders/${folder.id}`} asChild>
                  <Link href={`/folders/${folder.id}`}>
                    <FolderIcon className="size-4" />
                    <span>{folder.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
