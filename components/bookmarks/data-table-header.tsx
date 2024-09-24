import NiceModal from '@ebay/nice-modal-react'
import { IconBookmarkPlus, IconFileImport, IconPlus } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { DataTableColumnFilter } from '@/components/data-table/column-filter'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'

export function DataTableHeaders<T>({ table }: { table: Table<T> }) {
  return (
    <div className="mb-4 flex flex-col-reverse items-center gap-2 md:flex-row">
      <Input
        className="max-w-sm"
        placeholder="Filter by name"
        value={(table.getColumn('name')?.getFilterValue() as string) || ''}
        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
      />
      <div className="flex items-center space-x-2">
        <DataTableColumnFilter table={table} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" type="button">
              <IconPlus className="size-4" />
              <span className="sr-only">Bookmarks actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                void NiceModal.show(CreateBookmarkDialog)
              }}
            >
              <IconBookmarkPlus className="mr-2 size-4" />
              Create bookmark
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                void NiceModal.show(ImportBookmarksDialog)
              }}
            >
              <IconFileImport className="mr-2 size-4" />
              Import bookmarks
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
