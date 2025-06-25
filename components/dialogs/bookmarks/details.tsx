'use client'

import Link from 'next/link'
import type { Bookmark, OGInfo } from '@/types'
import { CalendarIcon, ExternalLinkIcon, FolderIcon, TagIcon } from 'lucide-react'
import { formatDateFromString, simplifiedURL } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BlurImage } from '@/components/blur-image'
import { RowActions } from '@/components/bookmarks/row-actions'
import { ToggleFavBtn } from '@/components/bookmarks/toggle-fav-btn'

interface BookmarkDetailsDialogProps {
  bookmark: Bookmark
  trigger: React.ReactNode
}

export function BookmarkDetailsDialog({ bookmark, trigger }: BookmarkDetailsDialogProps) {
  const ogInfo = bookmark?.og_info as unknown as OGInfo | undefined

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bookmark.name}</DialogTitle>
          {bookmark.description && (
            <DialogDescription className="line-clamp-2 break-words">{bookmark.description}</DialogDescription>
          )}
        </DialogHeader>
        {!bookmark.description && <DialogDescription className="sr-only">Details dialog</DialogDescription>}

        <div className="overflow-y-auto">
          <div className="flex items-center gap-2">
            <ExternalLinkIcon className="text-muted-foreground size-4" />
            <Button asChild variant="link" className="block truncate">
              <a href={bookmark.url} target="_blank" rel="noreferrer">
                {simplifiedURL(bookmark.url)}
              </a>
            </Button>
          </div>

          {bookmark.folder && (
            <div className="flex items-center space-x-2">
              <FolderIcon className="text-muted-foreground size-4" />
              <Button asChild variant="link">
                <Link href={`/folders/${bookmark.folder_id}`}>{bookmark.folder.name}</Link>
              </Button>
            </div>
          )}

          {bookmark.tag_items.length > 0 && (
            <div className="flex items-center space-x-2">
              <TagIcon className="text-muted-foreground size-4" />
              <div className="flex flex-1 flex-wrap items-center gap-1">
                {bookmark.tag_items.map((tagItem) => (
                  <Badge key={`${tagItem.id}-bk-details-tag`} variant="outline" asChild>
                    <Link href={`/tags/${tagItem.tag?.id}`}>{tagItem.tag?.name || ''}</Link>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <CalendarIcon className="text-muted-foreground size-4" />
            <span className="text-muted-foreground text-sm">{formatDateFromString(bookmark.created_at)}</span>
          </div>

          {ogInfo?.imageUrl && (
            <div className="bg-muted mt-4 h-48 w-full rounded-md object-cover md:h-64">
              <BlurImage src={ogInfo.imageUrl} alt={bookmark.name} />
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-end">
          <div className="flex justify-center gap-2">
            <ToggleFavBtn bookmark={bookmark} variant="outline" />
            <RowActions bookmark={bookmark} variant="outline" />
          </div>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
