import type { Bookmark, OGInfo } from '@/types'
import type { Row, Table } from '@tanstack/react-table'
import { ExternalLinkIcon, FolderIcon, TagIcon } from 'lucide-react'
import Link from 'next/link'
import { BookmarkDetailsDialog } from '@/components/dialogs/bookmarks/details'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { simplifiedURL } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { RowActions } from './row-actions'
import { ToggleFavBtn } from './toggle-fav-btn'

interface TableLayoutProps {
  table: Table<Bookmark>
}

function CardItem({ bookmark, row }: { bookmark: Bookmark; row: Row<Bookmark> }) {
  const ogInfo = bookmark.og_info as unknown as OGInfo | undefined

  return (
    <Card
      data-selected={row.getIsSelected()}
      className="data-[selected=true]:bg-muted/30 data-[selected=true]:dark:bg-muted/50"
    >
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Avatar className="size-4 rounded-none">
            <AvatarImage src={ogInfo?.faviconUrl} />
            <AvatarFallback />
          </Avatar>
          <BookmarkDetailsDialog
            bookmark={bookmark}
            trigger={
              <Button
                variant="link"
                className="text-foreground line-clamp-2 shrink text-left break-all whitespace-normal"
              >
                {bookmark.name}
              </Button>
            }
          />
        </CardTitle>
        {bookmark.description && (
          <CardDescription className="line-clamp-2 text-xs wrap-break-word">{bookmark.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="relative flex flex-col gap-1 text-sm">
        <div className="flex items-center space-x-2">
          <ExternalLinkIcon className="text-muted-foreground size-4" />
          <Button asChild variant="link" className="block truncate">
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              {simplifiedURL(bookmark.url)}
            </a>
          </Button>
        </div>

        {bookmark.tag_items.length > 0 && (
          <div className="flex items-center space-x-2">
            <TagIcon className="text-muted-foreground size-4" />
            <div className="flex flex-1 flex-wrap items-center gap-x-1">
              {bookmark.tag_items.map((tagItem) => (
                <Badge key={`${tagItem.id}-bk-details-tag`} variant="outline" asChild>
                  <Link href={`/tags/${tagItem.tag?.id}`}>{tagItem.tag?.name || ''}</Link>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {bookmark.folder && (
          <div className="flex items-center space-x-2">
            <FolderIcon className="text-muted-foreground size-4" />
            <Badge variant="outline" asChild>
              <Link href={`/folders/${bookmark.folder_id}`}>{bookmark.folder.name}</Link>
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-row items-center justify-between gap-2">
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
          }}
        />

        <div className="space-x-2">
          <ToggleFavBtn bookmark={bookmark} variant="outline" />
          <RowActions bookmark={bookmark} variant="outline" />
        </div>
      </CardFooter>
    </Card>
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
        <div className="text-muted-foreground flex h-24 items-center justify-center rounded-md border p-4 text-center text-sm">
          No results.
        </div>
      )}
    </>
  )
}
