import type { Bookmark } from '@/types'
import { IconArrowDown, IconArrowsSort, IconArrowUp, IconSelector } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function MansoryFilter({ table }: { table: Table<Bookmark> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <IconArrowsSort className="size-4" />
          <span className="sr-only">Mansory filters</span>
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
