import type { Bookmark } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import { IconBookmarkPlus, IconFileImport, IconLayoutDashboard, IconList, IconPlus } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { useTableLayoutStore } from '@/lib/stores/table-layout'
import { debounce } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { DataTableColumnFilter } from '@/components/data-table/column-filter'
import { MansoryFilter } from '@/components/data-table/mansory-filter'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { DataTableHeaderActions } from './header-actions'

export function DataTableHeaders({ table }: { table: Table<Bookmark> }) {
  const debouncedSetFilterValue = debounce((value: string) => {
    table.getColumn('name')?.setFilterValue(value)
  })

  const layout = useTableLayoutStore((state) => state.layout)
  const updateLayout = useTableLayoutStore((state) => state.update)
  const isMansoryLayout = layout === 'mansory'

  return (
    <div className="mb-4 flex flex-col-reverse items-center gap-2 md:flex-row">
      <Input
        className="max-w-sm"
        placeholder="Filter by name or description"
        onChange={(event) => {
          const value = event.target.value
          debouncedSetFilterValue(value)
        }}
      />
      <div className="flex w-full flex-wrap items-center justify-center gap-2 md:flex-nowrap md:justify-between">
        <div className="flex items-center gap-2">
          {isMansoryLayout ? <MansoryFilter table={table} /> : <DataTableColumnFilter table={table} />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" type="button">
                {isMansoryLayout ? <IconLayoutDashboard className="size-4" /> : <IconList className="size-4" />}
                <span className="sr-only">Layout</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Layout</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem onSelect={() => updateLayout('table')} checked={layout === 'table'}>
                <IconList className="mr-2 size-4" />
                Table
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onSelect={() => updateLayout('mansory')} checked={isMansoryLayout}>
                <IconLayoutDashboard className="mr-2 size-4" />
                Mansory
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" type="button">
                <IconPlus className="size-4" />
                <span className="sr-only">Bookmarks actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bookmarks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  void NiceModal.show(CreateBookmarkDialog)
                }}
              >
                <IconBookmarkPlus className="mr-2 size-4" />
                Create
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  void NiceModal.show(ImportBookmarksDialog)
                }}
              >
                <IconFileImport className="mr-2 size-4" />
                Import
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DataTableHeaderActions table={table} />
      </div>
    </div>
  )
}
