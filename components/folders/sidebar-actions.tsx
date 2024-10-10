import type { GenericFn } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import { IconDots, IconFolderPlus, IconReload } from '@tabler/icons-react'
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

interface SidebarFoldersActionsProps<T> {
  folders: Array<Tables<'folders'>>
  refetch: GenericFn<T>
}

export function SidebarFoldersActions<T>({ folders, refetch }: SidebarFoldersActionsProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" type="button" variant="ghost">
          <span className="sr-only">Open folders actions</span>
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Folders</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(CreateFolderDialog)
          }}
        >
          <IconFolderPlus className="mr-2 size-4" />
          Create folder
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            void refetch()
          }}
        >
          <IconReload className="mr-2 size-4" />
          Reload data
        </DropdownMenuItem>
        {/* {folders.length > 10 && (
          <DropdownMenuItem disabled>
            <IconInputSearch className="mr-2 size-4" />
            Toggle search
          </DropdownMenuItem>
        )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
