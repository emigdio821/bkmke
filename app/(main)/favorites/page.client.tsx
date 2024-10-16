'use client'

import Link from 'next/link'
import NiceModal from '@ebay/nice-modal-react'
import { IconBookmarkPlus, IconBookmarks, IconBug, IconHeartsOff, IconReload } from '@tabler/icons-react'
import { useFavoriteBookmarks } from '@/hooks/use-favorite-bookmarks'
import { Button } from '@/components/ui/button'
import { TypographyH4 } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { Loader } from '@/components/loader'

export function FavoritesClientPage() {
  const { data: bookmarks, isLoading, error } = useFavoriteBookmarks()

  if (isLoading) return <Loader />

  if (error)
    return (
      <div className="space-y-2 rounded-lg border p-6 text-center text-sm">
        <div>
          <div className="flex items-center justify-center space-x-2">
            <IconBug size={24} />
            <TypographyH4>Error</TypographyH4>
          </div>
          <p className="text-muted-foreground">Unable to fetch favorite bookmarks at this time, try again.</p>
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
                <IconHeartsOff size={24} />
                <TypographyH4>Empty</TypographyH4>
              </div>
              <p className="text-muted-foreground">You have no favorite bookmarks yet.</p>
            </div>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button variant="outline" asChild>
                <Link href="/">
                  <IconBookmarks size={16} className="mr-2" />
                  Bookmarks
                </Link>
              </Button>

              <Button variant="outline" onClick={() => NiceModal.show(CreateBookmarkDialog)}>
                <IconBookmarkPlus size={16} className="mr-2" />
                Create
              </Button>
            </div>
          </div>
        ))}
    </>
  )
}
