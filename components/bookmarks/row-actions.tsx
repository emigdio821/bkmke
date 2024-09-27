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
import { DeleteBookmarksDialog } from '@/components/dialogs/bookmarks/delete'
import { EditBookmarkDialog } from '@/components/dialogs/bookmarks/edit'
import { MoveToFolderDialog } from '@/components/dialogs/bookmarks/move-to-folder'
import { UpdateTagsDialog } from '@/components/dialogs/bookmarks/update-tags'

interface RowActionsProps {
  bookmark: Bookmark
  hideDetails?: boolean
}

export function RowActions({ bookmark, hideDetails }: RowActionsProps) {
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
        {!hideDetails && (
          <DropdownMenuItem asChild>
            <Link href={`/bookmarks/${bookmark.id}`}>
              <IconId className="mr-2 size-4 text-muted-foreground" />
              Details
            </Link>
          </DropdownMenuItem>
        )}
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
            void NiceModal.show(DeleteBookmarksDialog, {
              bookmark,
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
