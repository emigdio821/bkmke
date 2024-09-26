import Link from 'next/link'
import type { Bookmark } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import {
  IconCopy,
  IconDots,
  IconExternalLink,
  IconFolderShare,
  IconId,
  IconPencil,
  IconTags,
  IconTrash,
} from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import type { Row } from '@tanstack/react-table'
import { toast } from 'sonner'
import { BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { handleCopyToClipboard, urlWithUTMSource } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertActionDialog } from '@/components/dialogs/alert-action'
import { EditBookmarkDialog } from '@/components/dialogs/bookmarks/edit'
import { MoveToFolderDialog } from '@/components/dialogs/bookmarks/move-to-folder'
import { UpdateTagsDialog } from '@/components/dialogs/bookmarks/update-tags'

export function RowActions({ row }: { row: Row<Bookmark> }) {
  const bookmark = row.original
  const queryClient = useQueryClient()

  async function handleDeleteBookmark(bookmark: Bookmark) {
    const supabase = createClient()
    const { error } = await supabase.from('bookmarks').delete().eq('id', bookmark.id)

    if (error) {
      throw new Error(error.message)
    }

    toast.success('Success', { description: 'Bookmark has been deleted.' })
    await queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] })
    await queryClient.invalidateQueries({ queryKey: [FOLDER_ITEMS_QUERY] })
    await queryClient.invalidateQueries({ queryKey: [TAG_ITEMS_QUERY] })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-muted-foreground/10 data-[state=open]:bg-muted-foreground/10"
        >
          <span className="sr-only">Open row actions</span>
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-52">
        <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 break-all p-0">{bookmark.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(EditBookmarkDialog, { bookmark })
          }}
        >
          <IconPencil className="mr-2 size-4 text-muted-foreground" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={urlWithUTMSource(bookmark.url)} target="_blank">
            <IconExternalLink className="mr-2 size-4 text-muted-foreground" />
            Open
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/bookmarks/${bookmark.id}`}>
            <IconId className="mr-2 size-4 text-muted-foreground" />
            Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void handleCopyToClipboard(urlWithUTMSource(bookmark.url), 'URL copied')
          }}
        >
          <IconCopy className="mr-2 size-4 text-muted-foreground" />
          Copy URL
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(UpdateTagsDialog, {
              bookmark,
            })
          }}
        >
          <IconTags className="mr-2 size-4 text-muted-foreground" />
          Update tags
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(MoveToFolderDialog, { bookmark })
          }}
        >
          <IconFolderShare className="mr-2 size-4 text-muted-foreground" />
          Move to folder
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(AlertActionDialog, {
              action: async () => {
                await handleDeleteBookmark(bookmark)
              },
            })
          }}
          className="text-destructive focus:text-destructive"
        >
          <IconTrash className="mr-2 size-4 text-destructive/70" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
