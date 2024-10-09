'use client'

import Link from 'next/link'
import { IconReload } from '@tabler/icons-react'
import { useFavoriteBookmarks } from '@/hooks/use-favorite-bookmarks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { Loader } from '@/components/loader'

export function FavoritesClientPage() {
  const { data: bookmarks, isLoading, error } = useFavoriteBookmarks()

  if (isLoading) return <Loader />

  if (error)
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        <p>Unable to fetch favorite bookmarks, try again.</p>
        <p className="flex items-center">
          <Button variant="link">
            Refetch <IconReload className="ml-2 size-4" />
          </Button>
        </p>
      </div>
    )

  return (
    <>
      {bookmarks &&
        (bookmarks.length > 0 ? (
          <DataTable columns={columns} data={bookmarks} />
        ) : (
          <Card>
            <CardContent className="p-6">
              <CardDescription>
                You have no favorite bookmarks yet. <br />
                Go to{' '}
                <Button variant="underline" asChild>
                  <Link href="/">bookmarks</Link>
                </Button>
                , and start adding them there.
              </CardDescription>
            </CardContent>
          </Card>
        ))}
    </>
  )
}
