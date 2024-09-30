'use client'

import Link from 'next/link'
import type { OGInfo } from '@/types'
import {
  IconChevronLeft,
  IconExternalLink,
  IconFolder,
  IconHash,
  IconReload,
  IconTag,
  IconWorld,
} from '@tabler/icons-react'
import { formatDateFromString, simplifiedURL } from '@/lib/utils'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RowActions } from '@/components/bookmarks/row-actions'
import { Loader } from '@/components/loader'

export function BookmarkDetailsClientPage({ id }: { id: number }) {
  const { data, error, isLoading } = useBookmarks(id)
  const bookmark = data?.[0]
  const ogInfo = bookmark?.og_info as unknown as OGInfo | undefined

  if (isLoading) return <Loader />

  if (error) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        <p>Unable to fetch bookmark details at this time.</p>
        <p className="flex items-center">
          <Button variant="link">
            <IconReload className="mr-2 size-4" />
            Refetch
          </Button>
        </p>
      </div>
    )
  }

  return (
    <>
      {bookmark ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between space-x-2 text-lg">
              <p className="flex flex-col sm:flex-row sm:items-center">
                <Avatar className="mr-2 size-4 rounded-[4px]">
                  <AvatarImage src={ogInfo?.faviconUrl} />
                  <AvatarFallback className="rounded-[inherit]">
                    <IconWorld className="size-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                {bookmark.name}
              </p>
              <RowActions bookmark={bookmark} hideDetails />
            </CardTitle>
            <CardDescription>
              <Button asChild variant="link">
                <a href={bookmark.url} target="_blank">
                  {simplifiedURL(bookmark.url)}
                  <IconExternalLink className="ml-2 size-4" />
                </a>
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {bookmark.description && <p className="mb-2">{bookmark.description}</p>}

            {bookmark.folder && (
              <div className="flex items-center space-x-2">
                <IconFolder className="size-4" />
                <Button asChild variant="link">
                  <Link href={`/folders/${bookmark.folder_id}`}>{bookmark.folder.name}</Link>
                </Button>
              </div>
            )}

            {bookmark.tag_items.length > 0 && (
              <div className="flex items-center space-x-2">
                <IconTag className="size-4" />
                <div className="flex flex-1 flex-wrap items-center gap-x-1">
                  {bookmark.tag_items.map((tagItem) => (
                    <Button key={`${tagItem.id}-bk-details-tag`} variant="link" asChild>
                      <Link href={`/tags/${tagItem.id}`}>
                        <IconHash className="size-4" />
                        {tagItem.tag?.name || ''}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <small className="text-muted-foreground/80">{formatDateFromString(bookmark.created_at)}</small>
          </CardContent>
          {ogInfo?.imageUrl && (
            <CardFooter>
              <img
                className="h-36 w-full rounded-xxs bg-muted object-cover md:h-64"
                src={ogInfo.imageUrl}
                alt="Bookmark"
              />
            </CardFooter>
          )}
        </Card>
      ) : (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          <Button variant="link" asChild className="mb-4">
            <Link href="/">
              <IconChevronLeft className="mr-2 size-4" />
              All bookmarks
            </Link>
          </Button>
          <p className="font-semibold">Bookmark not found.</p>
          <p>Thee bookmark you're trying to see does not exist.</p>
        </div>
      )}
    </>
  )
}
