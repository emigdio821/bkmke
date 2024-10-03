import type { Bookmark } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import { IconBookmarkPlus, IconFileImport, IconPlus } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { debounce } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { DataTableColumnFilter } from '@/components/data-table/column-filter'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { DataTableHeaderActions } from './header-actions'

export function DataTableHeaders({ table }: { table: Table<Bookmark> }) {
  const debouncedSetFilterValue = debounce((value: string) => {
    table.getColumn('name')?.setFilterValue(value)
  })

  return (
    <div className="mb-4 flex flex-col-reverse items-center gap-2 md:flex-row">
      <Input
        className="max-w-sm bg-card"
        placeholder="Filter by name or description"
        onChange={(event) => {
          const value = event.target.value
          debouncedSetFilterValue(value)
        }}
      />
      <div className="flex w-full flex-wrap items-center justify-center gap-2 md:flex-nowrap md:justify-between">
        <div className="flex items-center gap-2">
          <DataTableColumnFilter table={table} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" type="button" className="data-[state=open]:bg-primary/90">
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
                <IconBookmarkPlus className="mr-2 size-4 text-muted-foreground" />
                Create bookmark
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  void NiceModal.show(ImportBookmarksDialog)
                }}
              >
                <IconFileImport className="mr-2 size-4 text-muted-foreground" />
                Import bookmarks
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DataTableHeaderActions table={table} />
      </div>
    </div>
  )
}
