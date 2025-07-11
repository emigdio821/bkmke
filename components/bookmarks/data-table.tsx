'use client'

import { useState } from 'react'
import type { Bookmark } from '@/types'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'
import { useTableLayoutStore } from '@/lib/stores/table-layout'
import { useQueryPagination } from '@/hooks/table/use-query-pagination'
import { DataTablePagination } from '@/components/data-table/pagination'
import { DataTableHeaders } from './data-table-header'
import { MasonryLayout } from './masonry-layout'
import { TableLayout } from './table-layout'

interface DataTableProps {
  columns: Array<ColumnDef<Bookmark>>
  data: Bookmark[]
}

export function DataTable({ columns, data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const layout = useTableLayoutStore((state) => state.layout)
  const [{ pageIndex, pageSize }, setPagination] = useQueryPagination()

  const table = useReactTable({
    data,
    columns,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater
      setPagination({
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      })
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    autoResetPageIndex: false,
    initialState: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  })

  return (
    <>
      <DataTableHeaders table={table} />
      <div className="mb-4">
        {layout === 'masonry' ? <MasonryLayout table={table} /> : <TableLayout table={table} />}
      </div>
      <DataTablePagination table={table} />
    </>
  )
}
