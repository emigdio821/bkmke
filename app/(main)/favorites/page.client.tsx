'use client'

import Link from 'next/link'
import NiceModal from '@ebay/nice-modal-react'
import { IconBookmarkPlus, IconBookmarks, IconBug, IconHeartsOff, IconReload } from '@tabler/icons-react'
import { useFavoriteBookmarks } from '@/hooks/use-favorite-bookmarks'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { Loader } from '@/components/loader'

export function FavoritesClientPage() {
  const { data: bookmarks, isLoading, error } = useFavoriteBookmarks()

  if (isLoading) return <Loader />

  if (error)
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center gap-2">
          <CardTitle className="mb-2">
            <IconBug size={24} />
          </CardTitle>
          <Heading>Error</Heading>
          <CardDescription className="text-center">
            Unable to fetch favorite bookmarks at this time, try again.
          </CardDescription>
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
        (bookmarks.length === 0 ? (
          <DataTable columns={columns} data={bookmarks} />
        ) : (
          <Card>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <CardTitle className="mb-2">
                <IconHeartsOff size={24} />
              </CardTitle>
              <Heading>Emtpy</Heading>
              <CardDescription className="text-center">You have no favorite bookmarks yet.</CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button variant="outline" onClick={() => NiceModal.show(CreateBookmarkDialog)}>
                <IconBookmarkPlus size={16} className="mr-2" />
                Create
              </Button>

              <Button variant="outline" asChild>
                <Link href="/">
                  <IconBookmarks size={16} className="mr-2" />
                  Bookmarks
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
    </>
  )
}
