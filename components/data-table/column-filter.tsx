import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableColumnFilterProps<T> {
  table: Table<T>
}

export function DataTableColumnFilter<T>({ table }: DataTableColumnFilterProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto border-dashed data-[state=open]:bg-accent">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const header = column.columnDef.header
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onSelect={(e) => {
                  e.preventDefault()
                }}
                onCheckedChange={(value) => {
                  column.toggleVisibility(!!value)
                }}
              >
                {typeof header === 'string' ? header : column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
