'use client'

import type { FolderDetailsData } from '@/lib/ts-queries/folders'
import { useQuery } from '@tanstack/react-query'
import { BookmarkIcon, BookmarkPlusIcon, BugIcon, FileUpIcon, RotateCwIcon, WindIcon } from 'lucide-react'
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
import { useHeaderTitleStore } from '@/lib/stores/header-title'
import { folderDetailsQuery, folderItemsQuery } from '@/lib/ts-queries/folders'

interface FolderItemsClientPageProps {
  folderId: string
  folderDetails: FolderDetailsData | null
}

export function FolderItemsClientPage({ folderId, folderDetails }: FolderItemsClientPageProps) {
  const { data: folderItems, isLoading, refetch, error } = useQuery(folderItemsQuery(folderId))
  const { data: folder } = useQuery(folderDetailsQuery(folderId, { initialData: folderDetails }))
  const updateHeaderTitle = useHeaderTitleStore((state) => state.updateTitle)
  const setLoadingHeaderTitle = useHeaderTitleStore((state) => state.setLoadingTitle)

  useEffect(() => {
    if (folder) {
      updateHeaderTitle(folder.name || 'Folder items')
      setLoadingHeaderTitle(false)
    }
  }, [folder, updateHeaderTitle, setLoadingHeaderTitle])

  if (error)
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
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RotateCwIcon className="size-4" />
            Refetch
          </Button>
        </CardFooter>
      </Card>
    )

  return (
    <>
      {isLoading ? (
        <Loader msg="Fetching folder bookmarks" />
      ) : (
        folderItems &&
        (folderItems.length > 0 ? (
          <DataTable columns={columns} data={folderItems} refetch={refetch} />
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
    </>
  )
}
