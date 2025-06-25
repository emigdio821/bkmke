import { useRef, useState } from 'react'
import type { Bookmark } from '@/types'
import type { Table } from '@tanstack/react-table'
import { BookmarkPlusIcon, FileUpIcon, LayoutDashboardIcon, PlusIcon, TableIcon, XIcon } from 'lucide-react'
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
          name="search-bookmarks"
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
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-2 md:flex-nowrap md:justify-between">
        <div className="flex items-center gap-2">
          {isMasonryLayout && <MasonryFilter table={table} />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" type="button">
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
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bookmarks</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <FileUpIcon className="size-4" />
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
