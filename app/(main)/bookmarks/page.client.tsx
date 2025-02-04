'use client'

import NiceModal from '@ebay/nice-modal-react'
import { IconBookmarkPlus, IconBookmarksOff, IconBug, IconFileImport, IconReload } from '@tabler/icons-react'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { Loader } from '@/components/loader'

export function BookmarksClientPage() {
  const { data: bookmarks, isLoading, error } = useBookmarks()

  if (isLoading) return <Loader msg="Fetching your bookmarks" />

  if (error)
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="mb-4">
            <IconBug size={24} />
          </CardTitle>
          <Heading>Error</Heading>
          <CardDescription className="text-center">Unable to fetch bookmarks at this time, try again.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button variant="outline">
            <IconReload className="mr-2 size-4" />
            Refetch
          </Button>
        </CardFooter>
      </Card>
    )

  return (
    <>
      {bookmarks &&
        (bookmarks.length > 0 ? (
          <DataTable columns={columns} data={bookmarks} />
        ) : (
          <Card>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <CardTitle className="mb-4">
                <IconBookmarksOff size={24} />
              </CardTitle>
              <Heading>Emtpy</Heading>
              <CardDescription className="text-center">You have no bookmarks yet.</CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button variant="outline" onClick={() => NiceModal.show(CreateBookmarkDialog)}>
                <IconBookmarkPlus size={16} className="mr-2" />
                Create
              </Button>

              <Button variant="outline" onClick={() => NiceModal.show(ImportBookmarksDialog)}>
                <IconFileImport size={16} className="mr-2" />
                Import
              </Button>
            </CardFooter>
          </Card>
        ))}
    </>
  )
}
