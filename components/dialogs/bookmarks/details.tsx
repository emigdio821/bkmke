'use client'

import { startTransition } from 'react'
import Link from 'next/link'
import type { Bookmark, OGInfo } from '@/types'
import {
  IconCalendarMonth,
  IconExternalLink,
  IconFolder,
  IconHash,
  IconHeart,
  IconHeartOff,
  IconTag,
} from '@tabler/icons-react'
import { formatDateFromString, simplifiedURL } from '@/lib/utils'
import { useToggleFavorite } from '@/hooks/use-toggle-favorite'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BlurImage } from '@/components/blur-image'
import { RowActions } from '@/components/bookmarks/row-actions'

interface BookmarkDetailsDialogProps {
  bookmark: Bookmark
  open: boolean
  setOpen: (opt: boolean) => void
}

export function BookmarkDetailsDialog({ bookmark, open, setOpen }: BookmarkDetailsDialogProps) {
  const ogInfo = bookmark?.og_info as unknown as OGInfo | undefined
  const { handleToggleFavorite, optimisticBk } = useToggleFavorite(bookmark)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{bookmark.name}</DialogTitle>
          {bookmark.description && (
            <DialogDescription className="line-clamp-2 break-words">{bookmark.description}</DialogDescription>
          )}
        </DialogHeader>

        <div>
          <div className="flex items-center space-x-2">
            <IconExternalLink className="size-4" />
            <Button asChild variant="link" className="block truncate">
              <a href={bookmark.url} target="_blank" rel="noreferrer">
                {simplifiedURL(bookmark.url)}
              </a>
            </Button>
          </div>

          {bookmark.tag_items.length > 0 && (
            <div className="flex items-center space-x-2">
              <IconTag className="size-4" />
              <div className="flex flex-1 flex-wrap items-center gap-x-1">
                {bookmark.tag_items.map((tagItem) => (
                  <Button key={`${tagItem.id}-bk-details-tag`} variant="link" asChild>
                    <Link href={`/tags/${tagItem.id}`}>
                      <IconHash className="size-4" />
                      {tagItem.tag?.name || ''}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {bookmark.folder && (
            <div className="flex items-center space-x-2">
              <IconFolder className="size-4" />
              <Button asChild variant="link">
                <Link href={`/folders/${bookmark.folder_id}`}>{bookmark.folder.name}</Link>
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <IconCalendarMonth className="size-4" />
            <span className="text-sm text-muted-foreground">{formatDateFromString(bookmark.created_at)}</span>
          </div>
        </div>

        {ogInfo?.imageUrl && (
          <div className="h-48 w-full rounded-sm bg-muted object-cover md:h-64">
            <BlurImage src={ogInfo.imageUrl} alt={bookmark.name} />
          </div>
        )}

        <DialogFooter className="flex-row items-center justify-end space-x-2 pt-6">
          <Button size="icon" onClick={() => startTransition(handleToggleFavorite)} variant="outline">
            {optimisticBk.is_favorite ? <IconHeartOff className="size-4" /> : <IconHeart className="size-4" />}
            <span className="sr-only">Toggle favorite status</span>
          </Button>
          <RowActions bookmark={bookmark} triggerProps={{ variant: 'outline' }} />
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
