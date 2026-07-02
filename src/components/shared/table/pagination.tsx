import type { Table } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps<T> {
  table: Table<T>
  pageSizeOptions?: readonly number[]
}

export const DEFAULT_TABLE_PAGE_SIZE = 10

export function DataTablePagination<T>({ table }: DataTablePaginationProps<T>) {
  return (
    <>
      <div className="flex w-full items-center justify-start gap-2 md:justify-baseline">
        <p className="text-sm text-muted-foreground">Viewing</p>
        <Select
          items={Array.from({ length: table.getPageCount() }, (_, i) => {
            const start = i * table.getState().pagination.pageSize + 1
            const end = Math.min((i + 1) * table.getState().pagination.pageSize, table.getRowCount())
            const pageNum = i + 1
            return { label: `${start}-${end}`, value: pageNum }
          })}
          onValueChange={(value) => {
            table.setPageIndex((value as number) - 1)
          }}
          value={table.getState().pagination.pageIndex + 1}
        >
          <SelectTrigger aria-label="Select result range" className="min-w-none w-fit" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.from({ length: table.getPageCount() }, (_, i) => {
                const start = i * table.getState().pagination.pageSize + 1
                const end = Math.min((i + 1) * table.getState().pagination.pageSize, table.getRowCount())
                const pageNum = i + 1
                return (
                  <SelectItem key={pageNum} value={pageNum}>
                    {`${start}-${end}`}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          of <strong className="font-medium text-foreground">{table.getRowCount()}</strong> results
        </p>
      </div>

      <div className="flex w-full items-center justify-end gap-2">
        <div className="flex items-center gap-1">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => table.previousPage()}
            aria-label="Ir a la página anterior"
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => table.nextPage()}
            aria-label="Ir a la página siguiente"
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
