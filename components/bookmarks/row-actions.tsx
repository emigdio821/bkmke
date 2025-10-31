import type { ButtonProps } from '@/components/ui/button'
import type { Bookmark } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  BookTextIcon,
  CopyIcon,
  ExternalLinkIcon,
  FolderIcon,
  HeartIcon,
  HeartOffIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TagIcon,
  Trash2Icon,
} from 'lucide-react'
import { startTransition } from 'react'
import { toast } from 'sonner'
import { AlertActionDialog } from '@/components/dialogs/alert-action'
import { BookmarkDetailsDialog } from '@/components/dialogs/bookmarks/details'
import { EditBookmarkDialog } from '@/components/dialogs/bookmarks/edit'
import { MoveToFolderDialog } from '@/components/dialogs/bookmarks/move-to-folder'
import { UpdateTagsDialog } from '@/components/dialogs/bookmarks/update-tags'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToggleFavorite } from '@/hooks/bookmarks/use-toggle-favorite'
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { deleteBookmark } from '@/lib/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY, FAV_BOOKMARKS_QUERY_KEY } from '@/lib/ts-queries/bookmarks'
import { FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { SIDEBAR_ITEM_COUNT_QUERY_KEY } from '@/lib/ts-queries/sidebar'
import { TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'
import { handleCopyToClipboard } from '@/lib/utils'

interface RowActionsProps extends ButtonProps {
  bookmark: Bookmark
  hideDetails?: boolean
}

const QUERY_KEYS_TO_INVALIDATE = [
  [BOOKMARKS_QUERY_KEY],
  [BOOKMARKS_QUERY_KEY, FAV_BOOKMARKS_QUERY_KEY],
  [SIDEBAR_ITEM_COUNT_QUERY_KEY],
  [FOLDERS_QUERY_KEY],
  [TAGS_QUERY_KEY],
]

export function RowActions({ bookmark, hideDetails, ...props }: RowActionsProps) {
  const modEnabled = useModEnabled()
  const queryClient = useQueryClient()
  const { handleToggleFavorite, optimisticBk } = useToggleFavorite(bookmark)

  const { mutateAsync: removeBookmarkMutate } = useMutation({
    mutationFn: async () => {
      const { error } = await deleteBookmark(bookmark.id)
      if (error) throw error
    },
    onSuccess: async () => {
      await Promise.all(QUERY_KEYS_TO_INVALIDATE.map((queryKey) => queryClient.invalidateQueries({ queryKey })))

      toast.success('Success', {
        description: (
          <div>
            Bookmark <span className="font-semibold">{bookmark.name}</span> has been removed.
          </div>
        ),
      })
    },
    onError: (error) => {
      console.error('Unable to remove bookmark', error)
      toast.error('Error', { description: 'Unable to remove bookmark at this time, try again' })
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="ghost" {...props}>
          <span className="sr-only">Open row actions</span>
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-52 min-w-44">
        <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 p-0 wrap-break-word">{bookmark.name}</DropdownMenuLabel>
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <BookTextIcon className="size-4" />
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
        {modEnabled && (
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
        {modEnabled && (
          <>
            <DropdownMenuSeparator />
            <AlertActionDialog
              destructive
              title="Delete bookmark?"
              action={async () => await removeBookmarkMutate()}
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
  )
}
