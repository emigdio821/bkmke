'use client'

import Link from 'next/link'
import type { Bookmark, OGInfo } from '@/types'
import { IconHash, IconWorld } from '@tabler/icons-react'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDateFromString, simplifiedURL, urlWithUTMSource } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { RowActions } from './row-actions'

export const columns: Array<ColumnDef<Bookmark>> = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value)
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value)
        }}
      />
    ),
  },
  {
    accessorKey: 'name',
    sortingFn: () => {
      return 1
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const bookmark = row.original
      const ogInfo = row.original.og_info as unknown as OGInfo | undefined

      return (
        <div className="flex max-w-64 flex-col items-start">
          <Button asChild variant="link" className="block w-full flex-auto overflow-hidden text-foreground">
            <Link href={`/bookmarks/${bookmark.id}`}>
              <div className="flex items-center">
                <Avatar className="mr-2 size-4 rounded-[4px]">
                  <AvatarImage src={ogInfo?.faviconUrl || ogInfo?.imageUrl} />
                  <AvatarFallback className="rounded-[inherit]">
                    <IconWorld className="size-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{bookmark.name}</span>
              </div>
            </Link>
          </Button>

          {bookmark.description && (
            <p className="line-clamp-2 w-full break-all text-xs text-muted-foreground" title={bookmark.description}>
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="URL" />,
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
    sortingFn: (rowA, rowB) => {
      const tagsA = rowA.original.tag_items.map((tag) => tag.tags?.name).filter(Boolean)
      const tagsB = rowB.original.tag_items.map((tag) => tag.tags?.name).filter(Boolean)

      const nameA = tagsA[0] || ''
      const nameB = tagsB[0] || ''

      return nameA.localeCompare(nameB)
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Folder" />,
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
    cell: ({ row }) => <RowActions bookmark={row.original} />,
  },
]
