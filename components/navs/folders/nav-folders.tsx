'use client'

import { PlusIcon, RotateCwIcon } from 'lucide-react'
import { useFolders } from '@/hooks/folders/use-folders'
import {
  SidebarGroup,
  SidebarGroupAction,
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
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <CreateFolderDialog
        trigger={
          <SidebarGroupAction title="Create folder">
            <PlusIcon />
            <span className="sr-only">Create tag</span>
          </SidebarGroupAction>
        }
      />
      <SidebarMenu>
        {isLoading &&
          Array.from(Array(5).keys()).map((n) => <SidebarMenuSkeleton key={`${n}-folders-skeleton`} showIcon />)}
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
    </SidebarGroup>
  )
}
