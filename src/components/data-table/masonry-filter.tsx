import type { Bookmark } from '@/types'
import type { Table } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon, CheckCheckIcon, EraserIcon } from 'lucide-react'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function MasonryFilter({ table }: { table: Table<Bookmark> }) {
  const isAllSelected = table.getIsAllPageRowsSelected()
  const hasSelectedRows = table.getSelectedRowModel().rows.length > 0
  const sortedRows = table.getState().sorting

  return (
    <div className="flex gap-2">
      <Button type="button" size="sm" variant="outline" onClick={() => table.toggleAllPageRowsSelected(!isAllSelected)}>
        {isAllSelected ? <EraserIcon className="size-4" /> : <CheckCheckIcon className="size-4" />}
        {isAllSelected ? 'Diselect all' : 'Select all'}
      </Button>

      {hasSelectedRows && !isAllSelected && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={() => table.toggleAllPageRowsSelected(false)}
            >
              <EraserIcon className="size-4" />
              <span className="sr-only">Diselect selection</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Diselect selection</TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="outline" className="relative">
                {sortedRows.length > 0 && (
                  <div className="bg-primary border-border absolute -top-1 -right-1 size-2.5 rounded-full border" />
                )}
                <ArrowDownUpIcon className="size-4" />
                <span className="sr-only">Masonry layout sort options</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <DropdownMenuContent align="end">
            {table.getAllColumns().map((column) => {
              const meta = column.columnDef.meta as { title?: string } | undefined
              const title = meta?.title || column.id

              if (!column.getCanSort()) return null

              const descSorted = column.getIsSorted() === 'desc'
              const ascSorted = column.getIsSorted() === 'asc'

              return (
                <DropdownMenuGroup key={column.id}>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span>{title}</span>
                      {descSorted && <ArrowDownIcon className="ml-2 size-4" />}
                      {ascSorted && <ArrowUpIcon className="ml-2 size-4" />}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem disabled={ascSorted} onSelect={() => column.toggleSorting(false)}>
                          <ArrowUpIcon className="size-4" />
                          Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={descSorted} onSelect={() => column.toggleSorting(true)}>
                          <ArrowDownIcon className="size-4" />
                          Desc
                        </DropdownMenuItem>

                        {column.getIsSorted() && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => {
                                column.clearSorting()
                              }}
                            >
                              <EraserIcon className="size-4" />
                              Clear sorting
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>Sort</TooltipContent>
      </Tooltip>
    </div>
  )
}
