import Link from 'next/link'
import type { Bookmark, OGInfo } from '@/types'
import { IconExternalLink, IconFolder, IconHash, IconHeart, IconTag, IconWorld } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { formatDateFromString, simplifiedURL } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BlurImage } from '@/components/blur-image'
import { RowActions } from './row-actions'

interface TableLayoutProps {
  table: Table<Bookmark>
}

function CardItem({ bookmark }: { bookmark: Bookmark }) {
  const ogInfo = bookmark.og_info as unknown as OGInfo | undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between space-x-2 break-words text-sm">
          <p className="flex flex-1 flex-col gap-1 overflow-hidden leading-none sm:flex-row sm:items-center">
            <Avatar className="mr-2 size-4 rounded-[4px]">
              <AvatarImage src={ogInfo?.faviconUrl} />
              <AvatarFallback className="rounded-[inherit]">
                <IconWorld className="size-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <Button asChild variant="link" className="line-clamp-2 whitespace-normal text-foreground">
              <Link href={`/bookmarks/${bookmark.id}`}>{bookmark.name}</Link>
            </Button>
          </p>
          <RowActions bookmark={bookmark} />
        </CardTitle>
        {bookmark.description && (
          <CardDescription className="line-clamp-2 break-words text-xs">{bookmark.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="relative text-sm">
        {bookmark.is_favorite && (
          <div className="absolute bottom-4 right-4">
            <IconHeart className="size-4" />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <IconExternalLink className="size-4" />
          <Button asChild variant="link" className="block flex-1 truncate">
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
    </Card>
  )
}

export function MansoryLayout({ table }: TableLayoutProps) {
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
            <div key={`mansory-column-${id}`} className="space-y-4">
              {rows.map((row) => (
                <CardItem key={row.id} bookmark={row.original} />
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
