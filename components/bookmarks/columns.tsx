'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, MoreHorizontal } from 'lucide-react'
import type { Tables } from '@/types/database.types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Bookmark = Tables<'bookmarks'>

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
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.original.tags
      const tagLinks = tags.map((tag, index) => (
        <Fragment key={tag}>
          <Button variant="link" asChild>
            <Link href={`/tags/${tag}`}>{tag}</Link>
          </Button>
          {index < tags.length - 1 && <span key={`${tag}-separator`}>, </span>}
        </Fragment>
      ))

      return tagLinks
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // const bookmark = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open row actions</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Details</DropdownMenuItem>
            <DropdownMenuItem>Open in new tab</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
