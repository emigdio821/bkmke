import { startTransition, useState } from 'react'
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
import { handleCopyToClipboard, isAdminRole } from '@/lib/utils'
import { useProfile } from '@/hooks/use-profile'
import { useToggleFavorite } from '@/hooks/use-toggle-favorite'
import { Button, type ButtonProps } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteBookmarksDialog } from '@/components/dialogs/bookmarks/delete'
import { BookmarkDetailsDialog } from '@/components/dialogs/bookmarks/details'
import { EditBookmarkDialog } from '@/components/dialogs/bookmarks/edit'
import { MoveToFolderDialog } from '@/components/dialogs/bookmarks/move-to-folder'
import { UpdateTagsDialog } from '@/components/dialogs/bookmarks/update-tags'

interface RowActionsProps extends ButtonProps {
  bookmark: Bookmark
  hideDetails?: boolean
}

export function RowActions({ bookmark, hideDetails, ...props }: RowActionsProps) {
  const { data: profile } = useProfile()
  const [openBookmarkDetails, setOpenBookmarkDetails] = useState(false)
  const { handleToggleFavorite, optimisticBk } = useToggleFavorite(bookmark)

  return (
    <>
      <BookmarkDetailsDialog open={openBookmarkDetails} setOpen={setOpenBookmarkDetails} bookmark={bookmark} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" {...props}>
            <span className="sr-only">Open row actions</span>
            <IconDots className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-52">
          <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 p-0 break-words">{bookmark.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => NiceModal.show(EditBookmarkDialog, { bookmark })}>
            <IconPencil className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              <IconExternalLink className="mr-2 size-4" />
              Open
            </a>
          </DropdownMenuItem>
          {!hideDetails && (
            <DropdownMenuItem onClick={() => setOpenBookmarkDetails(true)}>
              <IconId className="mr-2 size-4" />
              Details
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleCopyToClipboard(bookmark.url, 'URL copied')}>
            <IconCopy className="mr-2 size-4" />
            Copy URL
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              NiceModal.show(UpdateTagsDialog, {
                bookmark,
              })
            }
          >
            <IconTags className="mr-2 size-4" />
            Update tags
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => NiceModal.show(MoveToFolderDialog, { bookmark })}>
            <IconFolderShare className="mr-2 size-4" />
            Move to folder
          </DropdownMenuItem>
          {isAdminRole(profile?.user_role) && (
            <DropdownMenuItem onClick={() => startTransition(handleToggleFavorite)}>
              {optimisticBk.is_favorite ? (
                <>
                  <IconHeartOff className="mr-2 size-4" />
                  Remove from favorites
                </>
              ) : (
                <>
                  <IconHeart className="mr-2 size-4" />
                  Add to favorites
                </>
              )}
            </DropdownMenuItem>
          )}
          {isAdminRole(profile?.user_role) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  NiceModal.show(DeleteBookmarksDialog, {
                    bookmark,
                  })
                }
                className="text-destructive focus:text-destructive"
              >
                <IconTrash className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
