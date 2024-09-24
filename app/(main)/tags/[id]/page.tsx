'use client'

import Link from 'next/link'
import NiceModal from '@ebay/nice-modal-react'
import { IconReload } from '@tabler/icons-react'
import { useTagItems } from '@/hooks/use-tag-items'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TypographyH4 } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { BookmarksPageSkeleton } from '@/components/skeletons'

export default function TagitemsPage({ params }: { params: { id: string } }) {
  const tagId = params.id
  const { data: tagItems, isLoading, error } = useTagItems(Number(tagId))
  const { data: tag, isLoading: tagLoading } = useTags(Number(tagId))

  if (isLoading)
    return (
      <>
        <div className="mb-4 flex h-7 items-center">
          <Skeleton className="h-2 w-28" />
        </div>
        <BookmarksPageSkeleton />
      </>
    )

  if (error)
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        <p>Unable to fetch bookmarks, try again.</p>
        <p className="flex items-center">
          <Button variant="link">
            Refetch <IconReload className="ml-2 size-4" />
          </Button>
        </p>
      </div>
    )

  return (
    <>
      {tagLoading ? (
        <div className="flex h-7 items-center">
          <Skeleton className="h-2 w-28" />
        </div>
      ) : (
        <TypographyH4>{tag?.[0].name || 'Tag items'}</TypographyH4>
      )}
      <div className="mt-4">
        {tagItems && (
          <>
            {tagItems.length > 0 ? (
              <DataTable columns={columns} data={tagItems} />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <CardDescription>
                    This tag is empty. <br />
                    Start creating one bookmark{' '}
                    <Button
                      variant="underlineLink"
                      onClick={() => {
                        void NiceModal.show(CreateBookmarkDialog)
                      }}
                    >
                      here
                    </Button>{' '}
                    and assign the tags you want. <br />
                    Or go to{' '}
                    <Button variant="underlineLink">
                      <Link href="/">bookmarks</Link>
                    </Button>{' '}
                    and manage them there.
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  )
}
