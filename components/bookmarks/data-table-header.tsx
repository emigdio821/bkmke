import type { Bookmark } from '@/types'
import type { Table } from '@tanstack/react-table'
import { MasonryFilter } from '@/components/data-table/masonry-filter'
import { useTableLayoutStore } from '@/lib/stores/table-layout'
import { DataTableHeaderActions } from './header-actions'

interface DataTableHeadersProps {
  table: Table<Bookmark>
  refetch: () => void
}

export function DataTableHeaders({ table, refetch }: DataTableHeadersProps) {
  const layout = useTableLayoutStore((state) => state.layout)
  const isMasonryLayout = layout === 'masonry'

  return (
    <section className="flex justify-end gap-2">
      <DataTableHeaderActions table={table} refetch={refetch} />
      {isMasonryLayout && <MasonryFilter table={table} />}
    </section>
  )
}
