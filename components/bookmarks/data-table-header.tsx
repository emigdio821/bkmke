import type { Bookmark } from '@/types'
import type { Table } from '@tanstack/react-table'
import { useTableLayoutStore } from '@/lib/stores/table-layout'
import { MasonryFilter } from '@/components/data-table/masonry-filter'
import { DataTableHeaderActions } from './header-actions'

export function DataTableHeaders({ table }: { table: Table<Bookmark> }) {
  const layout = useTableLayoutStore((state) => state.layout)
  const isMasonryLayout = layout === 'masonry'

  return (
    <>
      {isMasonryLayout && <MasonryFilter table={table} />}
      <DataTableHeaderActions table={table} />
    </>
  )
}
