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
import { useFolder } from '@/hooks/use-folder'
import { useFolderItems } from '@/hooks/use-folder-items'
import { Button } from '@/components/ui/button'
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
      <div className="space-y-2 rounded-lg border p-6 text-center text-sm">
        <div>
          <div className="flex items-center justify-center space-x-2">
            <IconBug size={24} />
            <TypographyH4>Error</TypographyH4>
          </div>
          <p className="text-muted-foreground">
            Unable to fetch this folder at this time, try again or check if the folder still exists.
          </p>
        </div>
        <Button variant="outline">
          <IconReload className="mr-2 size-4" />
          Refetch
        </Button>
      </div>
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
              <TypographyH4>{folder[0]?.name || 'Folder items'}</TypographyH4>
              {folder[0]?.description && <p className="text-sm text-muted-foreground">{folder[0].description}</p>}
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
                <div className="space-y-6 rounded-lg border p-6 text-center text-sm">
                  <div>
                    <div className="flex items-center justify-center space-x-2">
                      <IconFolderOff size={24} />
                      <TypographyH4>Empty</TypographyH4>
                    </div>
                    <p className="text-muted-foreground">This folder does not contain items yet.</p>
                  </div>
                  <div className="flex flex-col justify-center gap-2 sm:flex-row">
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
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </>
  )
}
