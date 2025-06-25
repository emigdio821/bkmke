'use client'

import Link from 'next/link'
import { BookmarkIcon, BookmarkPlusIcon, BugIcon, FileUpIcon, RotateCw, WindIcon } from 'lucide-react'
import { useTagItems } from '@/hooks/tags/use-tag-items'
import { useTags } from '@/hooks/tags/use-tags'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Heading } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { Loader } from '@/components/loader'

export function TagitemsClientPage({ id }: { id: string }) {
  const tagId = id
  const { data: tagItems, isLoading, error } = useTagItems(tagId)
  const { data: tag, isLoading: tagLoading, error: tagError } = useTags(tagId)

  if (error || tagError)
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="mb-2">
            <BugIcon className="size-6" />
          </CardTitle>
          <Heading>Error</Heading>
          <CardDescription className="text-center">
            Unable to fetch this tag at this time, try again or check if the tag still exists.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button variant="outline">
            <RotateCw className="size-4" />
            Refetch
          </Button>
        </CardFooter>
      </Card>
    )

  return (
    <>
      {tagLoading ? (
        <div className="flex h-[18px] items-center">
          <Skeleton className="h-3 w-28" />
        </div>
      ) : (
        <Heading>{tag?.[0]?.name || 'Tag items'}</Heading>
      )}
      <div className="mt-4">
        {isLoading ? (
          <Loader msg="Fetching tag bookmarks" />
        ) : (
          tagItems &&
          (tagItems.length > 0 ? (
            <DataTable columns={columns} data={tagItems} />
          ) : (
            <Card>
              <CardHeader className="flex flex-col items-center justify-center gap-2">
                <CardTitle className="mb-2">
                  <WindIcon className="size-6" />
                </CardTitle>
                <Heading>Emtpy</Heading>
                <CardDescription className="text-center">This tag does not contain items yet.</CardDescription>
              </CardHeader>
              <CardFooter className="justify-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/">
                    <BookmarkIcon className="size-4" />
                    Bookmarks
                  </Link>
                </Button>

                <CreateBookmarkDialog
                  trigger={
                    <Button variant="outline">
                      <BookmarkPlusIcon className="size-4" />
                      Create
                    </Button>
                  }
                />

                <ImportBookmarksDialog
                  trigger={
                    <Button variant="outline">
                      <FileUpIcon className="size-4" />
                      Import
                    </Button>
                  }
                />
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  )
}
