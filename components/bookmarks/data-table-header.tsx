import { useRef, useState } from 'react'
import type { Bookmark } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import {
  IconBookmarkPlus,
  IconCircleX,
  IconFileImport,
  IconLayoutDashboard,
  IconList,
  IconPlus,
} from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { useTableLayoutStore } from '@/lib/stores/table-layout'
import { useDebounceFn } from '@/hooks/use-debounce-fn'
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
import { MasonryFilter } from '@/components/data-table/masonry-filter'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { DataTableHeaderActions } from './header-actions'

export function DataTableHeaders({ table }: { table: Table<Bookmark> }) {
  const [inputValue, setInputValue] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const layout = useTableLayoutStore((state) => state.layout)
  const updateLayout = useTableLayoutStore((state) => state.update)
  const isMasonryLayout = layout === 'masonry'

  const debouncedFilter = useDebounceFn(handleSearchFilter)

  function handleSearchFilter(value: string) {
    filterTable(value)
  }

  function handleClearInput() {
    setInputValue('')
    filterTable('')
    searchRef.current?.focus()
  }

  function filterTable(value: string) {
    table.getColumn('name')?.setFilterValue(value)
  }

  return (
    <div className="mb-4 flex flex-col-reverse items-center gap-2 md:flex-row">
      <div className="relative w-full max-w-sm">
        <Input
          type="search"
          ref={searchRef}
          value={inputValue}
          className="peer ps-9 pe-9"
          placeholder="Search by name or description"
          onChange={(event) => {
            const value = event.target.value
            setInputValue(value)
            debouncedFilter(value)
          }}
        />
        {inputValue && (
          <Button
            size="icon"
            type="button"
            variant="unstyled"
            aria-label="Clear input"
            onClick={handleClearInput}
            className="text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 transition-colors focus:z-10"
          >
            <IconCircleX size={16} strokeWidth={2} aria-hidden />
          </Button>
        )}
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-2 md:flex-nowrap md:justify-between">
        <div className="flex items-center gap-2">
          {isMasonryLayout ? <MasonryFilter table={table} /> : <DataTableColumnFilter table={table} />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" type="button">
                {isMasonryLayout ? <IconLayoutDashboard className="size-4" /> : <IconList className="size-4" />}
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
              <DropdownMenuCheckboxItem onSelect={() => updateLayout('masonry')} checked={isMasonryLayout}>
                <IconLayoutDashboard className="mr-2 size-4" />
                Masonry
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

              <ImportBookmarksDialog
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <IconFileImport className="mr-2 size-4" />
                    Import
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DataTableHeaderActions table={table} />
      </div>
    </div>
  )
}
