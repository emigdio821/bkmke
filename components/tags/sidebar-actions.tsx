import type { GenericFn } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import { IconDots, IconReload, IconTag } from '@tabler/icons-react'
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

interface SidebarFoldersActionsProps<T> {
  tags: Array<Tables<'tags'>>
  refetch: GenericFn<T>
}

export function SidebarTagsActions<T>({ tags, refetch }: SidebarFoldersActionsProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" type="button" variant="ghost" className="data-[state=open]:bg-accent">
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
          <IconTag className="mr-2 size-4 text-muted-foreground" />
          Create tag
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            void refetch()
          }}
        >
          <IconReload className="mr-2 size-4 text-muted-foreground" />
          Reload data
        </DropdownMenuItem>
        {/* {tags.length > 10 && (
          <DropdownMenuItem disabled>
            <IconInputSearch className="mr-2 size-4 text-muted-foreground" />
            Toggle search
          </DropdownMenuItem>
        )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
