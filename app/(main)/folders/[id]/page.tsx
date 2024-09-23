'use client'

import Link from 'next/link'
import NiceModal from '@ebay/nice-modal-react'
import { IconReload } from '@tabler/icons-react'
import { useFolderItems } from '@/hooks/use-folder-items'
import { useFolders } from '@/hooks/use-folders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TypographyH4 } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { BookmarksPageSkeleton } from '@/components/skeletons'

export default function FoldersPage({ params }: { params: { id: string } }) {
  const folderId = params.id
  const { data: folderItems, isLoading, error } = useFolderItems(Number(folderId))
  const { data: folder, isLoading: folderLoading } = useFolders(Number(folderId))

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
      {folderLoading ? (
        <div className="flex h-7 items-center">
          <Skeleton className="h-2 w-28" />
        </div>
      ) : (
        <TypographyH4>{folder?.[0].name || 'Folder items'}</TypographyH4>
      )}
      <div className="mt-4">
        {folderItems && (
          <>
            {folderItems.length > 0 ? (
              <DataTable columns={columns} data={folderItems} />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <CardDescription>
                    This foler is empty. <br />
                    Start creating one bookmark{' '}
                    <Button
                      variant="underlineLink"
                      onClick={() => {
                        void NiceModal.show(CreateBookmarkDialog)
                      }}
                    >
                      here
                    </Button>{' '}
                    and move it to this folder. <br />
                    Or go to{' '}
                    <Button variant="underlineLink">
                      <Link href="/">bookmarks</Link>
                    </Button>{' '}
                    and move existing ones here.
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
