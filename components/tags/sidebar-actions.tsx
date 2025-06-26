import { MoreHorizontalIcon, SearchIcon, TagIcon } from 'lucide-react'
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
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Tags</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <CreateTagDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <TagIcon className="size-4" />
              Create
            </DropdownMenuItem>
          }
        />
        {tags.length > 100 && (
          <DropdownMenuItem disabled>
            <SearchIcon className="text-muted-foreground size-4" />
            Toggle search
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
