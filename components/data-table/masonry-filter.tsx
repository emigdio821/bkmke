import type { Bookmark } from '@/types'
import { IconArrowDown, IconArrowsSort, IconArrowUp } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
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
          <IconArrowsSort className="size-4" />
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
                    <IconArrowDown className="mr-2 size-4" />
                  ) : (
                    column.getIsSorted() === 'asc' && <IconArrowUp className="mr-2 size-4" />
                  )}
                  {meta?.title || column.id}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onSelect={() => column.toggleSorting(false)}>
                      <IconArrowUp className="mr-2 size-4" />
                      Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => column.toggleSorting(true)}>
                      <IconArrowDown className="mr-2 size-4" />
                      Desc
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center" onSelect={() => table.toggleAllPageRowsSelected(!isAllSelected)}>
          {isAllSelected ? 'Clear selected' : 'Select all'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
