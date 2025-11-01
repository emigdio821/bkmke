import type { Column } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, EraserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const descSorted = column.getIsSorted() === 'desc'
  const ascSorted = column.getIsSorted() === 'asc'

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="[&_svg:not([class*='text-'])]:text-muted-foreground">
            <span>{title}</span>
            {descSorted ? (
              <ArrowDownIcon className="size-4" />
            ) : ascSorted ? (
              <ArrowUpIcon className="size-4" />
            ) : (
              <ChevronsUpDownIcon className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            disabled={ascSorted}
            onSelect={() => {
              column.toggleSorting(false)
            }}
          >
            <ArrowUpIcon className="size-4" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={descSorted}
            onSelect={() => {
              column.toggleSorting(true)
            }}
          >
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
