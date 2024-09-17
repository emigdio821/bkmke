'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import type { Bookmark } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookTextIcon,
  CopyIcon,
  ExternalLinkIcon,
  MoreHorizontal,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react'
import { extractUrlDomain, handleCopyToClipboard } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditBookmarkDialog } from './edit-dialog'

export const columns: Array<ColumnDef<Bookmark>> = [
  // {
  //   accessorKey: 'created_at',
  //   header: 'Created at',
  // },
  // {
  //   accessorKey: 'updated_at',
  //   header: 'Updated at',
  // },
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
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = row.original.url || ''
      const domain = extractUrlDomain(url)

      return domain || url
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    filterFn: (row, _, value) => {
      const hasTag = row.original.tag_items.some((item) => {
        return value.includes(item.tag_id?.toString())
      })
      return hasTag
    },
    cell: ({ row }) => {
      const tags = row.original.tag_items
      const tagLinks = tags?.map((tag, index) => (
        <Fragment key={`${tag.tag_id}-tag-table-item`}>
          <Button variant="link" asChild>
            <Link href={`/tags/${tag.tag_id}`}>{tag.tags?.name}</Link>
          </Button>
          {index < tags.length - 1 && <span key={`${tag.tag_id}-separator`}>, </span>}
        </Fragment>
      ))

      return tagLinks
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const bookmark = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open row actions</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditBookmarkDialog
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                  }}
                >
                  <PencilIcon className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
              }
            />
            <DropdownMenuItem>
              <BookTextIcon className="mr-2 size-4" />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                void handleCopyToClipboard(bookmark.url, 'URL copied')
              }}
            >
              <CopyIcon className="mr-2 size-4" />
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={bookmark.url} target="_blank">
                <ExternalLinkIcon className="mr-2 size-4" />
                Open in new tab
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2Icon className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
