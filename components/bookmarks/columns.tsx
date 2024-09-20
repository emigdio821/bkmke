'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import type { Bookmark, OGInfo } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, GlobeIcon } from 'lucide-react'
import { formatDateFromString, simplifiedURL, urlWithUTMSource } from '@/lib/utils'
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
          {sortDirection === 'asc' ? (
            <ArrowUpIcon className="ml-2 size-4" />
          ) : (
            <ArrowDownIcon className="ml-2 size-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const bookmark = row.original
      const ogInfo = row.original.og_info as unknown as OGInfo

      return (
        <div className="flex max-w-48 flex-col items-start">
          <Button variant="link" type="button" className="text-foreground">
            <Avatar className="mr-2 size-4 rounded-[4px]">
              <AvatarImage src={ogInfo?.faviconUrl || ogInfo?.imageUrl} />
              <AvatarFallback className="rounded-[inherit]">
                <GlobeIcon className="size-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <span className="max-w-44 truncate">{bookmark.name}</span>
          </Button>
          {bookmark.description && (
            <p className="line-clamp-2 text-muted-foreground" title={bookmark.description}>
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
    filterFn: (row, _, value) => {
      const hasTag = row.original.tag_items.some((item) => {
        return value.includes(item.id.toString())
      })
      return hasTag
    },
    cell: ({ row }) => {
      const tags = row.original.tag_items
      const tagLinks = tags?.map((tag, index) => (
        <Fragment key={`${tag.id}-tag-table-item`}>
          <Button variant="link" asChild>
            <Link href={`/tags/${tag.tags?.id}`}>{tag.tags?.name}</Link>
          </Button>
          {index < tags.length - 1 && <span key={`${tag.tags?.id}-separator`}>, </span>}
        </Fragment>
      ))

      return tagLinks
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
