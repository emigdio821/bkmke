import type { Table } from '@tanstack/react-table'
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '../ui/label'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

const PAGINATION = [12, 24, 36, 48, 60]

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const rowLength = table.getFilteredRowModel().rows.length
  const filteredRowLength = table.getFilteredSelectedRowModel().rows.length

  if (rowLength === 0) return null

  return (
    <div className="flex items-baseline justify-between space-x-2 sm:items-center">
      <div className="text-muted-foreground flex-1 text-sm">
        {filteredRowLength} of {rowLength} selected.
      </div>
      <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Label className="text-muted-foreground" htmlFor="table-pagination-select">
              Items per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value: string) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-[70px]" id="table-pagination-select">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top" align="end">
                {PAGINATION.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => {
              table.setPageIndex(0)
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronFirstIcon className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => {
              table.previousPage()
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="size-4" />
          </Button>

          <div className="text-sm font-medium">
            {table.getState().pagination.pageIndex + 1}
            <span className="text-muted-foreground">/{table.getPageCount()}</span>
          </div>

          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => {
              table.nextPage()
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1)
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronLastIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
