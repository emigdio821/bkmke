import Link from 'next/link'
import type { Bookmark } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import {
  IconCopy,
  IconDots,
  IconExternalLink,
  IconFolderShare,
  IconHeart,
  IconHeartOff,
  IconId,
  IconPencil,
  IconTags,
  IconTrash,
} from '@tabler/icons-react'
import { toast } from 'sonner'
import {
  BOOKMARKS_QUERY,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  TAG_ITEMS_QUERY,
} from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { handleCopyToClipboard } from '@/lib/utils'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
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
  const supabase = createClient()
  const { invalidateQueries } = useInvalidateQueries()

  async function handleToggleFavorite() {
    const updatePromise = new Promise((resolve, reject) => {
      supabase
        .from('bookmarks')
        .update({
          url: bookmark.url,
          name: bookmark.name,
          description: bookmark.description,
          folder_id: bookmark.folder_id,
          og_info: bookmark.og_info,
          is_favorite: !bookmark.is_favorite,
        })
        .eq('id', bookmark.id)
        .then(({ error }) => {
          if (error) {
            reject(error.message)
          }

          resolve('ok')
        })
    })

    toast.promise(updatePromise, {
      loading: 'Updating favorite status...',
      success: async () => {
        await invalidateQueries([
          FOLDERS_QUERY,
          BOOKMARKS_QUERY,
          FOLDER_ITEMS_QUERY,
          TAG_ITEMS_QUERY,
          FAV_BOOKMARKS_QUERY,
        ])

        return 'Favorite status has been updated.'
      },
      error: 'Unable to toggle favorite at this time, try again.',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="hover:bg-muted-foreground/10">
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
          <a href={bookmark.url} target="_blank" rel="noreferrer">
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
            void handleCopyToClipboard(bookmark.url, 'URL copied')
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
        <DropdownMenuItem
          onClick={() => {
            void handleToggleFavorite()
          }}
        >
          {bookmark.is_favorite ? (
            <>
              <IconHeartOff className="mr-2 size-4 text-muted-foreground" />
              Remove from favorites
            </>
          ) : (
            <>
              <IconHeart className="mr-2 size-4 text-muted-foreground" />
              Add to favorites
            </>
          )}
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
