'use client'

import Link from 'next/link'
import type { Bookmark, OGInfo } from '@/types'
import { IconArrowUp, IconHash, IconWorld } from '@tabler/icons-react'
import type { ColumnDef } from '@tanstack/react-table'
import { cn, formatDateFromString, simplifiedURL, urlWithUTMSource } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RowActions } from './row-actions'

export const columns: Array<ColumnDef<Bookmark>> = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value)
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value)
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    sortingFn: () => {
      return 1
    },
    header: ({ column }) => {
      const sortDirection = column.getIsSorted()

      return (
        <Button
          variant="link"
          className="text-muted-foreground"
          onClick={() => {
            column.toggleSorting(sortDirection === 'asc')
          }}
        >
          Name
          <IconArrowUp
            className={cn('ml-2 size-4', {
              'rotate-180': sortDirection === 'asc',
            })}
          />
        </Button>
      )
    },
    cell: ({ row }) => {
      const bookmark = row.original
      const ogInfo = row.original.og_info as unknown as OGInfo | undefined

      return (
        <div className="flex max-w-48 flex-col items-start">
          <Button asChild variant="link" type="button" className="text-foreground">
            <Link href={`/bookmarks/${bookmark.id}`}>
              <Avatar className="mr-2 size-4 rounded-[4px]">
                <AvatarImage src={ogInfo?.faviconUrl || ogInfo?.imageUrl} />
                <AvatarFallback className="rounded-[inherit]">
                  <IconWorld className="size-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <span className="max-w-48 truncate">{bookmark.name}</span>
            </Link>
          </Button>
          {bookmark.description && (
            <p className="line-clamp-2 w-full text-muted-foreground" title={bookmark.description}>
              {bookmark.description}
            </p>
          )}
          <small className="text-muted-foreground/80">{formatDateFromString(bookmark.created_at)}</small>
        </div>
      )
    },
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = row.original.url

      return (
        <Button asChild variant="link">
          <a href={urlWithUTMSource(url)} target="_blank">
            {simplifiedURL(url)}
          </a>
        </Button>
      )
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.original.tag_items

      return (
        <div className="flex max-w-40 flex-1 flex-wrap items-center gap-x-1">
          {tags.map((tagItem) => (
            <Button key={`${tagItem.id}-tag-table-item`} variant="link" asChild>
              <Link href={`/tags/${tagItem.tags?.id}`}>
                <IconHash className="size-4" />
                {tagItem.tags?.name || ''}
              </Link>
            </Button>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'folder_id',
    header: 'Folder',
    cell: ({ row }) => {
      const bookmark = row.original
      const folderName = bookmark.folders?.name

      return (
        <Button variant="link" asChild>
          <Link href={`/folders/${bookmark.folder_id}`}>{folderName}</Link>
        </Button>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions row={row} />,
  },
]
