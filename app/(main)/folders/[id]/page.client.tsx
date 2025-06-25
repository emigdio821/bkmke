'use client'

import Link from 'next/link'
import { BookmarkIcon, BookmarkPlusIcon, BugIcon, FileUpIcon, RotateCwIcon, WindIcon } from 'lucide-react'
import { useFolder } from '@/hooks/folders/use-folder'
import { useFolderItems } from '@/hooks/folders/use-folder-items'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TypographyH4 } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { Loader } from '@/components/loader'

export function FolderItemsClientPage({ id }: { id: string }) {
  const folderId = id
  const { data: folderItems, isLoading, error } = useFolderItems(folderId)
  const { data: folder, isLoading: folderLoading, error: folderError } = useFolder(folderId)

  if (error || folderError)
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="mb-4">
            <BugIcon className="size-6" />
          </CardTitle>
          <TypographyH4>Error</TypographyH4>
          <CardDescription className="text-center">
            Unable to fetch this folder at this time, try again or check if the folder still exists.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button variant="outline">
            <RotateCwIcon className="size-4" />
            Refetch
          </Button>
        </CardFooter>
      </Card>
    )

  return (
    <>
      {folderLoading ? (
        <div>
          <div className="flex h-[18px] items-center">
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="mt-4 flex h-5 items-center">
            <Skeleton className="h-2 w-36" />
          </div>
        </div>
      ) : (
        folder && (
          <>
            <TypographyH4 className="mb-4">{folder[0]?.name || 'Folder items'}</TypographyH4>
            {folder[0]?.description && <p className="text-muted-foreground text-sm">{folder[0].description}</p>}
          </>
        )
      )}
      <div className="mt-4">
        {isLoading ? (
          <Loader msg="Fetching folder bookmarks" />
        ) : (
          folderItems &&
          (folderItems.length > 0 ? (
            <DataTable columns={columns} data={folderItems} />
          ) : (
            <Card>
              <CardHeader className="flex flex-col items-center justify-center gap-2">
                <CardTitle className="mb-2">
                  <WindIcon className="size-6" />
                </CardTitle>
                <TypographyH4>Emtpy</TypographyH4>
                <CardDescription className="text-center">This folder does not contain items yet.</CardDescription>
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
