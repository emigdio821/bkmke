'use client'

import Link from 'next/link'
import NiceModal from '@ebay/nice-modal-react'
import { IconBookmarkPlus, IconBookmarks, IconBug, IconFileImport, IconReload, IconTagOff } from '@tabler/icons-react'
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
        <CardHeader className="flex flex-col items-center justify-center gap-2">
          <CardTitle className="mb-2">
            <IconBug size={24} />
          </CardTitle>
          <Heading>Error</Heading>
          <CardDescription className="text-center">
            Unable to fetch this tag at this time, try again or check if the tag still exists.
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
      {tagLoading ? (
        <div className="flex h-7 items-center">
          <Skeleton className="h-2 w-28" />
        </div>
      ) : (
        <Heading>{tag?.[0]?.name || 'Tag items'}</Heading>
      )}
      <div className="mt-4">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {tagItems &&
              (tagItems.length > 0 ? (
                <DataTable columns={columns} data={tagItems} />
              ) : (
                <Card>
                  <CardHeader className="flex flex-col items-center justify-center gap-2">
                    <CardTitle className="mb-2">
                      <IconTagOff size={24} />
                    </CardTitle>
                    <Heading>Emtpy</Heading>
                    <CardDescription className="text-center">This tag does not contain items yet.</CardDescription>
                  </CardHeader>
                  <CardFooter className="justify-center">
                    <Button variant="outline" asChild>
                      <Link href="/">
                        <IconBookmarks size={16} className="mr-2" />
                        Bookmarks
                      </Link>
                    </Button>

                    <Button variant="outline" onClick={() => NiceModal.show(CreateBookmarkDialog)}>
                      <IconBookmarkPlus size={16} className="mr-2" />
                      Create bookmark
                    </Button>

                    <ImportBookmarksDialog
                      trigger={
                        <Button variant="outline">
                          <IconFileImport size={16} className="mr-2" />
                          Import
                        </Button>
                      }
                    />
                  </CardFooter>
                </Card>
              ))}
          </>
        )}
      </div>
    </>
  )
}
