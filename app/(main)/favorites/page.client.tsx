'use client'

import { BookmarkIcon, BookmarkPlusIcon, BugIcon, RotateCwIcon, WindIcon } from 'lucide-react'
import Link from 'next/link'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TypographyH4 } from '@/components/ui/typography'
import { useFavoriteBookmarks } from '@/hooks/bookmarks/use-favorite-bookmarks'

export function FavoritesClientPage() {
  const { data: bookmarks, isLoading, refetch, error } = useFavoriteBookmarks()

  if (isLoading) return <Loader msg="Fetching your favorite bookmarks" />

  if (error)
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="mb-4">
            <BugIcon className="size-6" />
          </CardTitle>
          <TypographyH4>Error</TypographyH4>
          <CardDescription className="text-center">
            Unable to fetch favorite bookmarks at this time, try again.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RotateCwIcon className="size-4" />
            Refetch
          </Button>
        </CardFooter>
      </Card>
    )

  return (
    <>
      {bookmarks &&
        (bookmarks.length > 0 ? (
          <DataTable columns={columns} data={bookmarks} refetch={refetch} />
        ) : (
          <Card>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <CardTitle className="mb-2">
                <WindIcon className="size-6" />
              </CardTitle>
              <TypographyH4>Emtpy</TypographyH4>
              <CardDescription className="text-center">You have no favorite bookmarks yet.</CardDescription>
            </CardHeader>
            <CardFooter className="justify-center gap-2">
              <CreateBookmarkDialog
                trigger={
                  <Button variant="outline">
                    <BookmarkPlusIcon className="size-4" />
                    Create
                  </Button>
                }
              />

              <Button variant="outline" asChild>
                <Link href="/">
                  <BookmarkIcon className="size-4" />
                  Bookmarks
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
    </>
  )
}
