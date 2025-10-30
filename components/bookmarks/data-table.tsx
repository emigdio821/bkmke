'use client'

import type { Bookmark } from '@/types'
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DataTablePagination } from '@/components/data-table/pagination'
import { useQueryPagination } from '@/hooks/table/use-query-pagination'
import { useDebounceFn } from '@/hooks/use-debounce-fn'
import { useGlobalSearch } from '@/hooks/use-global-search'
import { useTableLayoutStore } from '@/lib/stores/table-layout'
import { DataTableHeaders } from './data-table-header'
import { MasonryLayout } from './masonry-layout'
import { TableLayout } from './table-layout'

interface DataTableProps {
  columns: Array<ColumnDef<Bookmark>>
  data: Bookmark[]
  refetch: () => void
}

export function DataTable({ columns, data, refetch }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const layout = useTableLayoutStore((state) => state.layout)
  const [{ pageIndex, pageSize }, setPagination] = useQueryPagination()
  const [search] = useGlobalSearch()
  const isFirstRender = useRef(true)

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

  const filterTable = useCallback(
    (value: string) => {
      table.getColumn('name')?.setFilterValue(value)
    },
    [table.getColumn, table],
  )

  const handleSearchFilter = useCallback(
    (value: string) => {
      filterTable(value)
    },
    [filterTable],
  )

  const debouncedFilter = useDebounceFn(handleSearchFilter)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      filterTable(search)
    } else {
      debouncedFilter(search)
    }
  }, [search, filterTable, debouncedFilter])

  return (
    <>
      <DataTableHeaders table={table} refetch={refetch} />
      {layout === 'masonry' ? <MasonryLayout table={table} /> : <TableLayout table={table} />}
      <DataTablePagination table={table} />
    </>
  )
}
