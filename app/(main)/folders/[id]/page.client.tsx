'use client'

import Link from 'next/link'
import NiceModal from '@ebay/nice-modal-react'
import { IconChevronLeft, IconReload } from '@tabler/icons-react'
import { useFolder } from '@/hooks/use-folder'
import { useFolderItems } from '@/hooks/use-folder-items'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TypographyH4 } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
// import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { Loader } from '@/components/loader'

export function FolderItemsClientPage({ id }: { id: string }) {
  const folderId = id
  const { data: folderItems, isLoading, error } = useFolderItems(Number(folderId))
  const { data: folder, isLoading: folderLoading } = useFolder(Number(folderId))

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

  if (folderLoading) {
    return (
      <div className="flex h-7 items-center">
        <Skeleton className="h-2 w-28" />
      </div>
    )
  }

  if (!folder?.length) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        <Button variant="link" asChild className="mb-4">
          <Link href="/">
            <IconChevronLeft className="mr-2 size-4" />
            All bookmarks
          </Link>
        </Button>
        <p className="font-semibold">Folder not found.</p>
        <p>The folder you're trying to see does not exist.</p>
      </div>
    )
  }

  return (
    <>
      <TypographyH4>{folder[0]?.name || 'Folder items'}</TypographyH4>
      {folder[0]?.description && <p className="text-sm text-muted-foreground">{folder[0].description}</p>}
      <div className="mt-4">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {folderItems && (
              <>
                {folderItems.length > 0 ? (
                  <DataTable columns={columns} data={folderItems} />
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <CardDescription>
                        <span className="font-semibold">This folder is empty.</span>
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
                        {/* <Button
                          variant="underlineLink"
                          onClick={() => {
                            void NiceModal.show(ImportBookmarksDialog)
                          }}
                        >
                          import
                        </Button>{' '} */}
                        your bookmarks and move them to this folder. <br />
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
