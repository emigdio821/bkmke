'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDownIcon, PlusIcon, RotateCwIcon } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import { folderListQuery } from '@/lib/ts-queries/folders'
import { CreateFolderDialog } from '../../dialogs/folders/create-folder'
import { NavFolderItem } from './nav-folder-item'

export function NavFolders() {
  const { data: folders, isLoading, error, refetch } = useQuery(folderListQuery())

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <ChevronDownIcon className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
              Folders
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CreateFolderDialog
          trigger={
            <SidebarGroupAction title="Create folder">
              <PlusIcon />
              <span className="sr-only">Create tag</span>
            </SidebarGroupAction>
          }
        />
        <CollapsibleContent className="pt-1" asChild>
          <SidebarGroupContent>
            <SidebarMenu>
              {error && (
                <SidebarMenuButton onClick={() => refetch()}>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Refetch folders</span>
                  </div>
                  <RotateCwIcon className="ml-auto size-4" />
                </SidebarMenuButton>
              )}
              {isLoading ? (
                Array.from(Array(3).keys()).map((n) => <SidebarMenuSkeleton key={`${n}-folders-skeleton`} showIcon />)
              ) : folders && folders.length > 0 ? (
                folders.map((folder) => <NavFolderItem key={folder.id} folder={folder} />)
              ) : (
                <p className="text-muted-foreground text-xs">Folders are empty.</p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
