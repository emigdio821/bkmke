'use client'

import NiceModal from '@ebay/nice-modal-react'
import { IconReload } from '@tabler/icons-react'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { BookmarksPageSkeleton } from '@/components/skeletons'

export function BookmarksClientPage() {
  const { data: bookmarks, isLoading, error } = useBookmarks()

  if (isLoading) return <BookmarksPageSkeleton />

  if (error)
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        <p>Unable to fetch bookmarks, try again.</p>
        <p className="flex items-center">
          <Button variant="link">
            Refetch <IconReload className="ml-2 size-4" />
          </Button>
        </p>
      </div>
    )

  return (
    <>
      {bookmarks && (
        <>
          {bookmarks.length > 0 ? (
            <DataTable columns={columns} data={bookmarks} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <CardDescription>
                  You have no bookmarks yet. <br />
                  Start creating one{' '}
                  <Button
                    variant="underlineLink"
                    onClick={() => {
                      void NiceModal.show(CreateBookmarkDialog)
                    }}
                  >
                    here
                  </Button>
                  .
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  )
}
