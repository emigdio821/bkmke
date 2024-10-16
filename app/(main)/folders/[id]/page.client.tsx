'use client'

import Link from 'next/link'
import NiceModal from '@ebay/nice-modal-react'
import {
  IconBookmarkPlus,
  IconBookmarks,
  IconChevronLeft,
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
