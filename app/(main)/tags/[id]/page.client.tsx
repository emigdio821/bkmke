'use client'

import Link from 'next/link'
import NiceModal from '@ebay/nice-modal-react'
import { IconBookmarkPlus, IconBookmarks, IconBug, IconFileImport, IconReload, IconTagOff } from '@tabler/icons-react'
import { useTagItems } from '@/hooks/use-tag-items'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TypographyH4 } from '@/components/ui/typography'
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
      <div className="space-y-2 rounded-lg border p-6 text-center text-sm">
        <div>
          <div className="flex items-center justify-center space-x-2">
            <IconBug size={24} />
            <TypographyH4>Error</TypographyH4>
          </div>
          <p className="text-muted-foreground">
            Unable to fetch this tag at this time, try again or check if the tag still exists.
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
            {tagItems &&
              (tagItems.length > 0 ? (
                <DataTable columns={columns} data={tagItems} />
              ) : (
                <div className="space-y-6 rounded-lg border p-6 text-center text-sm">
                  <div>
                    <div className="flex items-center justify-center space-x-2">
                      <IconTagOff size={24} />
                      <TypographyH4>Empty</TypographyH4>
                    </div>
                    <p className="text-muted-foreground">This tag does not contain items yet.</p>
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
