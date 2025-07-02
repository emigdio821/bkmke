'use client'

import { ChevronDownIcon, PlusIcon, RotateCwIcon } from 'lucide-react'
import { useFolders } from '@/hooks/folders/use-folders'
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
import { CreateFolderDialog } from '../../dialogs/folders/create-folder'
import { NavFolderItem } from './nav-folder-item'

export function NavFolders() {
  const { data: folders, isLoading, error, refetch } = useFolders()

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel className="hover:opacity-80" asChild>
          <CollapsibleTrigger>
            <ChevronDownIcon className="mr-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            Folders
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
              {isLoading &&
                Array.from(Array(3).keys()).map((n) => <SidebarMenuSkeleton key={`${n}-folders-skeleton`} showIcon />)}
              {error && (
                <SidebarMenuButton onClick={() => refetch()}>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Refetch folders</span>
                  </div>
                  <RotateCwIcon className="ml-auto size-4" />
                </SidebarMenuButton>
              )}
              {folders?.map((folder) => (
                <NavFolderItem key={folder.id} folder={folder} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
