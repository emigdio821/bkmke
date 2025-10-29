import type { TableLayout } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface TableLayoutState {
  layout: TableLayout
  update: (layout: TableLayout) => void
}

export const useTableLayoutStore = create<TableLayoutState>()(
  devtools(
    persist(
      (set) => ({
        layout: 'table',
        update: (layout) => set(() => ({ layout }), false, 'update'),
      }),
      { name: 'bkmke-table-layout' },
    ),
    { name: 'bkmke', store: 'table-layout' },
  ),
)
