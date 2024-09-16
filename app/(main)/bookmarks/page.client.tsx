'use client'

import { useBookmarks } from '@/hooks/use-bookmarks'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'

export function BookmarksClientPage() {
  const { data: bookmarks } = useBookmarks()

  return (
    <div className="mt-4">
      {bookmarks && bookmarks.length > 0 ? (
        <DataTable columns={columns} data={bookmarks} />
      ) : (
        <div>Your bookmarks are empty</div>
      )}
    </div>
  )
}
