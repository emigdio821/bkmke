import type { Bookmark } from '@/types'
import type { Table } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon, CheckCheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function MasonryFilter({ table }: { table: Table<Bookmark> }) {
  const isAllSelected = table.getIsAllPageRowsSelected()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <ArrowDownUpIcon className="size-4" />
          <span className="sr-only">Masonry filters</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table.getAllColumns().map((column) => {
          const meta = column.columnDef.meta as { title?: string } | undefined

          if (!column.getCanSort()) return null

          return (
            <DropdownMenuGroup key={column.id}>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {column.getIsSorted() === 'desc' ? (
                    <ArrowDownIcon className="mr-2 size-4" />
                  ) : (
                    column.getIsSorted() === 'asc' && <ArrowUpIcon className="mr-2 size-4" />
                  )}
                  {meta?.title || column.id}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onSelect={() => column.toggleSorting(false)}>
                      <ArrowUpIcon className="size-4" />
                      Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => column.toggleSorting(true)}>
                      <ArrowDownIcon className="size-4" />
                      Desc
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => table.toggleAllPageRowsSelected(!isAllSelected)}>
          <CheckCheckIcon className="size-4" />
          {isAllSelected ? 'Clear selected' : 'Select all'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
