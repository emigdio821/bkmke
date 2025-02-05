'use client'

import Link from 'next/link'
import NiceModal from '@ebay/nice-modal-react'
import {
  IconBookmarkPlus,
  IconBookmarks,
  IconBug,
  IconFileImport,
  IconFolderOff,
  IconReload,
} from '@tabler/icons-react'
import { useFolder } from '@/hooks/folders/use-folder'
import { useFolderItems } from '@/hooks/folders/use-folder-items'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Heading } from '@/components/ui/typography'
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
        <CardHeader className="flex flex-col items-center justify-center gap-2">
          <CardTitle className="mb-2">
            <IconBug size={24} />
          </CardTitle>
          <Heading>Error</Heading>
          <CardDescription className="text-center">
            Unable to fetch this folder at this time, try again or check if the folder still exists.
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
      {folderLoading ? (
        <div>
          <div className="flex h-7 items-center">
            <Skeleton className="h-2 w-28" />
          </div>
          <div className="flex h-5 items-center">
            <Skeleton className="h-2 w-36" />
          </div>
        </div>
      ) : (
        <>
          {folder && (
            <>
              <Heading>{folder[0]?.name || 'Folder items'}</Heading>
              {folder[0]?.description && <p className="text-muted-foreground text-sm">{folder[0].description}</p>}
            </>
          )}
        </>
      )}
      <div className="mt-4">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {folderItems &&
              (folderItems.length > 0 ? (
                <DataTable columns={columns} data={folderItems} />
              ) : (
                <Card>
                  <CardHeader className="flex flex-col items-center justify-center gap-2">
                    <CardTitle className="mb-2">
                      <IconFolderOff size={24} />
                    </CardTitle>
                    <Heading>Emtpy</Heading>
                    <CardDescription className="text-center">This folder does not contain items yet.</CardDescription>
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

                    <Button variant="outline" onClick={() => NiceModal.show(ImportBookmarksDialog)}>
                      <IconFileImport size={16} className="mr-2" />
                      Import bookmarks
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </>
        )}
      </div>
    </>
  )
}
