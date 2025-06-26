import { FolderPlusIcon, MoreHorizontalIcon, SearchIcon } from 'lucide-react'
import type { Tables } from '@/types/database.types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'

interface SidebarFoldersActionsProps {
  folders: Array<Tables<'folders'>>
}

export function SidebarFoldersActions({ folders }: SidebarFoldersActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" type="button" variant="ghost">
          <span className="sr-only">Open folders actions</span>
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Folders</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <CreateFolderDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <FolderPlusIcon className="size-4" />
              Create
            </DropdownMenuItem>
          }
        />

        {folders.length > 100 && (
          <DropdownMenuItem disabled>
            <SearchIcon className="size-4" />
            Toggle search
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
