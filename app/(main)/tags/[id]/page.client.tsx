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
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { Loader } from '@/components/loader'

export function TagitemsClientPage({ id }: { id: string }) {
  const tagId = id
  const { data: tagItems, isLoading, error } = useTagItems(Number(tagId))
  const { data: tag, isLoading: tagLoading } = useTags(Number(tagId))

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
        <TypographyH4>{tag?.[0]?.name || 'Tag items'}</TypographyH4>
      )}
      <div className="mt-4">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {tagItems && (
              <>
                {tagItems.length > 0 ? (
                  <DataTable columns={columns} data={tagItems} />
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <CardDescription>
                        <span className="font-semibold">This tag is empty.</span>
                        <br />
                        <Button
                          variant="underlineLink"
                          onClick={() => {
                            void NiceModal.show(CreateBookmarkDialog)
                          }}
                        >
                          Create
                        </Button>{' '}
                        or{' '}
                        <Button
                          variant="underlineLink"
                          onClick={() => {
                            void NiceModal.show(ImportBookmarksDialog)
                          }}
                        >
                          import
                        </Button>{' '}
                        your bookmarks and assign the tags you want. <br />
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
          </>
        )}
      </div>
    </>
  )
}
