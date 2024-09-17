'use client'

import { useBookmarks } from '@/hooks/use-bookmarks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { columns } from '@/components/bookmarks/columns'
import { CreateBookmarkDialog } from '@/components/bookmarks/create-dialog'
import { DataTable } from '@/components/bookmarks/data-table'
import { BookmarksPageSkeleton } from '@/components/skeletons'

export function BookmarksClientPage() {
  const { data: bookmarks, isLoading } = useBookmarks()

  if (isLoading) return <BookmarksPageSkeleton />

  return (
    <>
      {bookmarks && bookmarks.length > 0 ? (
        <DataTable columns={columns} data={bookmarks} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <CardDescription>You have no bookmarks yet.</CardDescription>
            <p className="mt-4 text-sm">
              Start creating one <CreateBookmarkDialog trigger={<Button variant="link">here</Button>} />.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  )
}
