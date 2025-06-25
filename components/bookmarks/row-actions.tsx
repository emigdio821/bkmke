import { startTransition } from 'react'
import type { Bookmark } from '@/types'
import {
  CopyIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  FolderIcon,
  HeartIcon,
  HeartOffIcon,
  PencilIcon,
  TagIcon,
  TextIcon,
  Trash2Icon,
} from 'lucide-react'
import { toast } from 'sonner'
import { areModificationsEnabled, handleCopyToClipboard } from '@/lib/utils'
import { useRemoveBookmarks } from '@/hooks/bookmarks/use-remove-bookmarks'
import { useToggleFavorite } from '@/hooks/bookmarks/use-toggle-favorite'
import { Button, type ButtonProps } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertActionDialog } from '@/components/dialogs/alert-action'
import { BookmarkDetailsDialog } from '@/components/dialogs/bookmarks/details'
import { EditBookmarkDialog } from '@/components/dialogs/bookmarks/edit'
import { MoveToFolderDialog } from '@/components/dialogs/bookmarks/move-to-folder'
import { UpdateTagsDialog } from '@/components/dialogs/bookmarks/update-tags'

interface RowActionsProps extends ButtonProps {
  bookmark: Bookmark
  hideDetails?: boolean
}

export function RowActions({ bookmark, hideDetails, ...props }: RowActionsProps) {
  const { handleRemoveBookmarks } = useRemoveBookmarks()
  const { handleToggleFavorite, optimisticBk } = useToggleFavorite(bookmark)

  async function handleRemoveBk() {
    try {
      await handleRemoveBookmarks([bookmark])
      toast.success('Success', {
        description: (
          <div>
            Bookmark <span className="font-semibold">{bookmark.name}</span> has been removed.
          </div>
        ),
      })
    } catch (err) {
      console.error('Unable to remove bookmark', err)
      toast.error('Error', { description: 'Unable to remove bookmark at this time, try again' })
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" {...props}>
            <span className="sr-only">Open row actions</span>
            <EllipsisIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-52">
          <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 p-0 break-words">{bookmark.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <EditBookmarkDialog
            bookmark={bookmark}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PencilIcon className="size-4" />
                Edit
              </DropdownMenuItem>
            }
          />
          <DropdownMenuItem asChild>
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              <ExternalLinkIcon className="size-4" />
              Open
            </a>
          </DropdownMenuItem>
          {!hideDetails && (
            <BookmarkDetailsDialog
              bookmark={bookmark}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                  }}
                >
                  <TextIcon className="size-4" />
                  Details
                </DropdownMenuItem>
              }
            />
          )}
          <DropdownMenuItem onSelect={() => handleCopyToClipboard(bookmark.url, 'URL copied')}>
            <CopyIcon className="size-4" />
            Copy URL
          </DropdownMenuItem>
          <UpdateTagsDialog
            bookmark={bookmark}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <TagIcon className="size-4" />
                Update tags
              </DropdownMenuItem>
            }
          />
          <MoveToFolderDialog
            bookmark={bookmark}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <FolderIcon className="size-4" />
                Move to folder
              </DropdownMenuItem>
            }
          />
          {areModificationsEnabled() && (
            <DropdownMenuItem onSelect={() => startTransition(handleToggleFavorite)}>
              {optimisticBk.is_favorite ? (
                <>
                  <HeartOffIcon className="size-4" />
                  Remove from favorites
                </>
              ) : (
                <>
                  <HeartIcon className="size-4" />
                  Add to favorites
                </>
              )}
            </DropdownMenuItem>
          )}
          {areModificationsEnabled() && (
            <>
              <DropdownMenuSeparator />
              <AlertActionDialog
                destructive
                title="Delete bookmark?"
                action={async () => await handleRemoveBk()}
                trigger={
                  <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                    <Trash2Icon className="size-4" />
                    Delete
                  </DropdownMenuItem>
                }
              />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
