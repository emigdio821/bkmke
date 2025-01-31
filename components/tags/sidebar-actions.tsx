import NiceModal from '@ebay/nice-modal-react'
import { IconDots, IconInputSearch, IconTag } from '@tabler/icons-react'
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
import { CreateTagDialog } from '@/components/dialogs/tags/create-tag'

interface SidebarFoldersActionsProps {
  tags: Array<Tables<'tags'>>
}

export function SidebarTagsActions({ tags }: SidebarFoldersActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" type="button" variant="ghost">
          <span className="sr-only">Open tags actions</span>
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Tags</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(CreateTagDialog)
          }}
        >
          <IconTag className="mr-2 size-4" />
          Create
        </DropdownMenuItem>
        {tags.length > 100 && (
          <DropdownMenuItem disabled>
            <IconInputSearch className="text-muted-foreground mr-2 size-4" />
            Toggle search
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
