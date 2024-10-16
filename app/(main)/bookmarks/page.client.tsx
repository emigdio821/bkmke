'use client'

import NiceModal from '@ebay/nice-modal-react'
import { IconBookmarkPlus, IconBookmarksOff, IconBug, IconFileImport, IconReload } from '@tabler/icons-react'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { Button } from '@/components/ui/button'
import { TypographyH4 } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { Loader } from '@/components/loader'

export function BookmarksClientPage() {
  const { data: bookmarks, isLoading, error } = useBookmarks()

  if (isLoading) return <Loader />

  if (error)
    return (
      <div className="space-y-2 rounded-lg border p-6 text-center text-sm">
        <div>
          <div className="flex items-center justify-center space-x-2">
            <IconBug size={24} />
            <TypographyH4>Error</TypographyH4>
          </div>
          <p className="text-muted-foreground">Unable to fetch bookmarks at this time, try again.</p>
        </div>
        <Button variant="outline">
          <IconReload className="mr-2 size-4" />
          Refetch
        </Button>
      </div>
    )

  return (
    <>
      {bookmarks &&
        (bookmarks.length > 0 ? (
          <DataTable columns={columns} data={bookmarks} />
        ) : (
          <div className="space-y-6 rounded-lg border p-6 text-center text-sm">
            <div>
              <div className="flex items-center justify-center space-x-2">
                <IconBookmarksOff size={24} />
                <TypographyH4>Empty</TypographyH4>
              </div>
              <p className="text-muted-foreground">You have no bookmarks yet.</p>
            </div>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => NiceModal.show(CreateBookmarkDialog)}>
                <IconBookmarkPlus size={16} className="mr-2" />
                Create
              </Button>

              <Button variant="outline" onClick={() => NiceModal.show(ImportBookmarksDialog)}>
                <IconFileImport size={16} className="mr-2" />
                Import
              </Button>
            </div>
          </div>
        ))}
    </>
  )
}
