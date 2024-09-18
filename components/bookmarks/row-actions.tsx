import type { Bookmark } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import type { Row } from '@tanstack/react-table'
import {
  BookTextIcon,
  CopyIcon,
  ExternalLinkIcon,
  FolderInputIcon,
  MoreHorizontal,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react'
import { BOOKMARKS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { handleCopyToClipboard } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertActionDialog } from '@/components/alert-action-dialog'
import { MoveToFolderDialog } from '../move-to-folder-dialog'
import { EditBookmarkDialog } from './edit-dialog'

export function RowActions({ row }: { row: Row<Bookmark> }) {
  const bookmark = row.original
  const queryClient = useQueryClient()

  async function handleDeleteBookmark(id: number) {
    const supabase = createClient()
    const { error } = await supabase.schema('public').from('bookmarks').delete().eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    await queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open row actions</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{bookmark.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
        <MoveToFolderDialog
          bookmark={bookmark}
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <FolderInputIcon className="mr-2 size-4" />
              Move to folder
            </DropdownMenuItem>
          }
        />
        <DropdownMenuItem asChild>
          <a href={bookmark.url} target="_blank">
            <ExternalLinkIcon className="mr-2 size-4" />
            Open in new tab
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertActionDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2Icon className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          }
          action={async () => {
            await handleDeleteBookmark(bookmark.id)
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
