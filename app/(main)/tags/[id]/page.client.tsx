'use client'

import { BookmarkIcon, BookmarkPlusIcon, BugIcon, FileUpIcon, RotateCw, WindIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TypographyH4 } from '@/components/ui/typography'
import { useTagItems } from '@/hooks/tags/use-tag-items'
import { useTags } from '@/hooks/tags/use-tags'
import { useHeaderTitleStore } from '@/lib/stores/header-title'

export function TagitemsClientPage({ id }: { id: string }) {
  const tagId = id
  const { data: tagItems, isLoading, refetch, error } = useTagItems(tagId)
  const { data: tag, isLoading: tagLoading, error: tagError } = useTags(tagId)
  const updateHeaderTitle = useHeaderTitleStore((state) => state.updateTitle)
  const setLoadingHeaderTitle = useHeaderTitleStore((state) => state.setLoadingTitle)

  useEffect(() => {
    if (tag) {
      updateHeaderTitle(tag[0]?.name || 'Tag items')
    }
  }, [tag, updateHeaderTitle])

  useEffect(() => {
    setLoadingHeaderTitle(tagLoading)
  }, [tagLoading, setLoadingHeaderTitle])

  if (error || tagError)
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="mb-2">
            <BugIcon className="size-6" />
          </CardTitle>
          <TypographyH4>Error</TypographyH4>
          <CardDescription className="text-center">
            Unable to fetch this tag at this time, try again or check if the tag still exists.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RotateCw className="size-4" />
            Refetch
          </Button>
        </CardFooter>
      </Card>
    )

  return (
    <>
      {isLoading ? (
        <Loader msg="Fetching tag bookmarks" />
      ) : (
        tagItems &&
        (tagItems.length > 0 ? (
          <DataTable columns={columns} data={tagItems} refetch={refetch} />
        ) : (
          <Card>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <CardTitle className="mb-2">
                <WindIcon className="size-6" />
              </CardTitle>
              <TypographyH4>Emtpy</TypographyH4>
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
    </>
  )
}
