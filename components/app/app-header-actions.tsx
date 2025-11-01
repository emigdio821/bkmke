import {
  BookmarkIcon,
  BookmarkPlusIcon,
  FileUpIcon,
  FolderPlusIcon,
  LayoutDashboardIcon,
  PlusIcon,
  TableIcon,
  TagIcon,
} from 'lucide-react'
import { useTableLayoutStore } from '@/lib/stores/table-layout'
import { CreateBookmarkDialog } from '../dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '../dialogs/bookmarks/import'
import { CreateFolderDialog } from '../dialogs/folders/create-folder'
import { CreateTagDialog } from '../dialogs/tags/create-tag'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export function AppHeaderActions() {
  const layout = useTableLayoutStore((state) => state.layout)
  const updateLayout = useTableLayoutStore((state) => state.update)
  const isMasonryLayout = layout === 'masonry'

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" type="button" variant="outline">
            {isMasonryLayout ? <LayoutDashboardIcon className="size-4" /> : <TableIcon className="size-4" />}
            <span className="sr-only">Layout</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Layout</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem onSelect={() => updateLayout('table')} checked={layout === 'table'}>
            Table
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem onSelect={() => updateLayout('masonry')} checked={isMasonryLayout}>
            Masonry
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" type="button">
            <PlusIcon className="size-4" />
            <span className="sr-only">Bookmarks actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuGroup>
            <CreateFolderDialog
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <FolderPlusIcon className="size-4" />
                  Create folder
                </DropdownMenuItem>
              }
            />

            <CreateTagDialog
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <TagIcon className="size-4" />
                  Create tag
                </DropdownMenuItem>
              }
            />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <BookmarkIcon className="text-muted-foreground mr-2 size-4" />
                Bookmarks
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <CreateBookmarkDialog
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <BookmarkPlusIcon className="size-4" />
                        Create
                      </DropdownMenuItem>
                    }
                  />

                  <ImportBookmarksDialog
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <FileUpIcon className="size-4" />
                        Import
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
