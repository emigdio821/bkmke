import { startTransition, useState } from 'react'
import Link from 'next/link'
import type { Bookmark, OGInfo } from '@/types'
import {
  IconExternalLink,
  IconFolder,
  IconHash,
  IconHeart,
  IconHeartOff,
  IconTag,
  IconWorld,
} from '@tabler/icons-react'
import type { Row, Table } from '@tanstack/react-table'
import { simplifiedURL } from '@/lib/utils'
import { useToggleFavorite } from '@/hooks/use-toggle-favorite'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { BookmarkDetailsDialog } from '@/components/dialogs/bookmarks/details'
import { RowActions } from './row-actions'

interface TableLayoutProps {
  table: Table<Bookmark>
}

function CardItem({ bookmark, row }: { bookmark: Bookmark; row: Row<Bookmark> }) {
  const ogInfo = bookmark.og_info as unknown as OGInfo | undefined
  const { handleToggleFavorite, optimisticBk } = useToggleFavorite(bookmark)
  const [openBookmarkDetails, setOpenBookmarkDetails] = useState(false)
  const toggleSelectedItem = () => row.toggleSelected(!row.getIsSelected())

  return (
    <>
      <BookmarkDetailsDialog open={openBookmarkDetails} setOpen={setOpenBookmarkDetails} bookmark={bookmark} />
      <Card
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
            e.preventDefault()
            toggleSelectedItem()
          }
        }}
        data-selected={row.getIsSelected()}
        className="outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring data-[selected=true]:bg-muted/50"
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between space-x-2 break-words text-sm">
            <p className="flex flex-1 flex-col gap-1 overflow-hidden leading-none sm:flex-row sm:items-center">
              <Avatar className="mr-2 size-4 rounded-[4px]">
                <AvatarImage src={ogInfo?.faviconUrl} />
                <AvatarFallback className="rounded-[inherit]">
                  <IconWorld className="size-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <Button
                variant="link"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenBookmarkDetails((prev) => !prev)
                }}
                className="line-clamp-2 whitespace-normal text-left text-foreground focus-visible:underline focus-visible:outline-0"
              >
                {bookmark.name}
              </Button>
            </p>
          </CardTitle>
          {bookmark.description && (
            <CardDescription className="line-clamp-2 break-words text-xs">{bookmark.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="relative text-sm">
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
        </CardContent>

        <CardFooter className="justify-between space-x-2">
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
            }}
          />

          <div className="space-x-2">
            <Button onClick={() => startTransition(handleToggleFavorite)} size="icon" variant="outline">
              {optimisticBk.is_favorite ? <IconHeartOff className="size-4" /> : <IconHeart className="size-4" />}
            </Button>

            <RowActions bookmark={bookmark} triggerProps={{ variant: 'outline', className: 'hover:bg-accent' }} />
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export function MasonryLayout({ table }: TableLayoutProps) {
  const rows = table.getRowModel().rows
  const columns = Array.from({ length: 3 }, (_, index) => ({
    id: index,
    rows: rows.filter((_, rowIndex) => rowIndex % 3 === index),
  }))

  return (
    <>
      {rows.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {columns.map(({ id, rows }) => (
            <div key={`masonry-column-${id}`} className="space-y-4">
              {rows.map((row) => (
                <CardItem key={row.id} row={row} bookmark={row.original} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border p-4 text-sm">No results.</div>
      )}
    </>
  )
}
