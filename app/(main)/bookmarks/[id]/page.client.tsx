'use client'

import Link from 'next/link'
import type { OGInfo } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import {
  IconChevronLeft,
  IconExternalLink,
  IconFolder,
  IconFolderShare,
  IconHash,
  IconPencil,
  IconReload,
  IconTag,
  IconWorld,
} from '@tabler/icons-react'
import { simplifiedURL, urlWithUTMSource } from '@/lib/utils'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MoveToFolderDialog } from '@/components/dialogs/bookmarks/move-to-folder'
import { UpdateTagsDialog } from '@/components/dialogs/bookmarks/update-tags'
import { Loader } from '@/components/loader'

export function BookmarkDetailsClientPage({ id }: { id: number }) {
  const { data, error, isLoading } = useBookmarks(id)
  const bookmark = data?.[0]
  const ogInfo = bookmark?.og_info as unknown as OGInfo | undefined

  if (isLoading) return <Loader />

  if (error) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        <p>Unable to fetch bookmark details at this time.</p>
        <p className="flex items-center">
          <Button variant="link">
            <IconReload className="mr-2 size-4" />
            Refetch
          </Button>
        </p>
      </div>
    )
  }

  return (
    <>
      {bookmark ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Avatar className="mr-2 size-4 rounded-[4px]">
                <AvatarImage src={ogInfo?.faviconUrl} />
                <AvatarFallback className="rounded-[inherit]">
                  <IconWorld className="size-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              {bookmark.name}
            </CardTitle>
            <CardDescription>
              <Button asChild variant="link">
                <a href={urlWithUTMSource(bookmark.url)} target="_blank">
                  {simplifiedURL(bookmark.url)}
                  <IconExternalLink className="ml-2 size-4" />
                </a>
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {bookmark.description && <p>{bookmark.description}</p>}

            {ogInfo?.imageUrl && (
              <img
                className="my-2 h-36 w-full rounded-lg bg-muted object-cover md:h-64"
                src={ogInfo.imageUrl}
                alt="Bookmark"
              />
            )}

            {bookmark.folders ? (
              <div className="flex items-center space-x-2">
                <IconFolder className="size-4" />
                <Button asChild variant="link">
                  <Link href={`/folders/${bookmark.folder_id}`}>{bookmark.folders.name}</Link>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    void NiceModal.show(MoveToFolderDialog, { bookmark })
                  }}
                >
                  <IconPencil className="size-4" />
                  <span className="sr-only">Move to folder</span>
                </Button>
              </div>
            ) : (
              <div className="flex h-9 items-center space-x-2">
                <IconFolderShare className="size-4" />
                <Button
                  variant="link"
                  type="button"
                  onClick={() => {
                    void NiceModal.show(MoveToFolderDialog, { bookmark })
                  }}
                >
                  Move to folder
                </Button>
              </div>
            )}

            {bookmark.tag_items.length > 0 ? (
              <div className="flex items-center space-x-2">
                <IconTag className="size-4" />
                <div className="flex flex-1 flex-wrap items-center gap-x-1">
                  {bookmark.tag_items.map((tagItem) => (
                    <Button key={`${tagItem.id}-tag-table-item`} variant="link" asChild>
                      <Link href={`/tags/${tagItem.tags?.id}`}>
                        <IconHash className="size-4" />
                        {tagItem.tags?.name}
                      </Link>
                    </Button>
                  ))}
                  <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      void NiceModal.show(UpdateTagsDialog, {
                        bookmark,
                      })
                    }}
                  >
                    <IconPencil className="size-4" />
                    <span className="sr-only">Update tags</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-9 items-center space-x-2">
                <IconTag className="size-4" />
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    void NiceModal.show(UpdateTagsDialog, {
                      bookmark,
                    })
                  }}
                >
                  Update tags
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          <p>Bookmark not found.</p>
          <p className="flex items-center">
            <Button variant="link">
              <IconChevronLeft className="mr-2 size-4" />
              Go to bookmarks
            </Button>
          </p>
        </div>
      )}
    </>
  )
}
