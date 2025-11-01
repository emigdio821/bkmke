'use client'

import type { Bookmark, OGInfo } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { BookmarkDetailsDialog } from '@/components/dialogs/bookmarks/details'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { simplifiedURL } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { RowActions } from './row-actions'
import { ToggleFavBtn } from './toggle-fav-btn'

export const columns: Array<ColumnDef<Bookmark>> = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        className="bg-background"
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
    meta: {
      title: 'Name',
    },
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.name
      const nameB = rowB.original.name

      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    },
    filterFn: (row, _, value: string) => {
      return (
        row.original.name.toLowerCase().includes(value.toLowerCase()) ||
        row.original.description?.toLowerCase().includes(value.toLowerCase()) ||
        false
      )
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const bookmark = row.original
      const ogInfo = row.original.og_info as unknown as OGInfo | undefined

      return (
        <div className="flex max-w-64 flex-col items-start">
          <BookmarkDetailsDialog
            bookmark={bookmark}
            trigger={
              <Button variant="link" className="text-foreground block max-w-64 flex-auto overflow-hidden">
                <div className="flex items-center space-x-2">
                  <Avatar className="size-4 rounded-none">
                    <AvatarImage src={ogInfo?.faviconUrl || ogInfo?.imageUrl} />
                    <AvatarFallback />
                  </Avatar>
                  <span className="truncate">{bookmark.name}</span>
                </div>
              </Button>
            }
          />

          {bookmark.description && (
            <p className="text-muted-foreground w-full truncate text-xs" title={bookmark.description}>
              {bookmark.description}
            </p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'url',
    meta: {
      title: 'URL',
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="URL" />,
    cell: ({ row }) => {
      const url = row.original.url

      return (
        <Button asChild variant="link" className="inline-block max-w-48 truncate">
          <a href={url} target="_blank" rel="noreferrer">
            {simplifiedURL(url)}
          </a>
        </Button>
      )
    },
  },
  {
    accessorKey: 'folder_id',
    meta: {
      title: 'Folder',
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Folder" />,
    cell: ({ row }) => {
      const bookmark = row.original
      const folderName = bookmark.folder?.name

      if (!folderName) return null

      return (
        <Badge variant="outline" asChild>
          <Link href={`/folders/${bookmark.folder_id}`}>{folderName}</Link>
        </Badge>
      )
    },
  },
  {
    accessorKey: 'tags',
    meta: {
      title: 'Tags',
    },
    sortingFn: (rowA, rowB) => {
      const tagsA = rowA.original.tag_items.map((tag) => tag.tag?.name).filter(Boolean)
      const tagsB = rowB.original.tag_items.map((tag) => tag.tag?.name).filter(Boolean)

      const nameA = tagsA[0] || ''
      const nameB = tagsB[0] || ''

      return nameA.localeCompare(nameB)
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
    cell: ({ row }) => {
      const tags = row.original.tag_items

      if (tags.length === 0) return null

      return (
        <div className="flex max-w-40 flex-1 flex-wrap items-center gap-1">
          {tags.map((tagItem) => (
            <Badge key={`${tagItem.id}-tag-table-item`} variant="outline" asChild>
              <Link href={`/tags/${tagItem.tag?.id}`}>{tagItem.tag?.name || ''}</Link>
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end space-x-1">
          <ToggleFavBtn bookmark={row.original} className="hover:bg-highlight" />
          <RowActions bookmark={row.original} className="hover:bg-highlight data-[state=open]:bg-highlight" />
        </div>
      )
    },
  },
]
