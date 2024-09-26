import type { ColumnDef, Row } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

export function createMultiSelectColumn<T>(): ColumnDef<T> {
  let lastSelectedId = ''

  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value)
        }}
      />
    ),
    cell: ({ row, table }) => (
      <Checkbox
        id={`select-row-${row.id}`}
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        onClick={(e) => {
          if (e.shiftKey) {
            const { rows, rowsById } = table.getRowModel()
            const rowsToToggle = getRowRange(rows, row.id, lastSelectedId)
            const isLastSelected = rowsById[lastSelectedId].getIsSelected()
            rowsToToggle.forEach((row) => {
              row.toggleSelected(isLastSelected)
            })
          }

          lastSelectedId = row.id
        }}
      />
    ),
  }
}

function getRowRange<T>(rows: Array<Row<T>>, idA: string, idB: string) {
  const range: Array<Row<T>> = []
  let foundStart = false

  for (const row of rows) {
    if (row.id === idA || row.id === idB) {
      foundStart = true
    }

    if (foundStart) {
      range.push(row)
    }

    if (row.id === idB && foundStart) {
      break
    }
  }

  return range
}
