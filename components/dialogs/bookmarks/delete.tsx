import { useState } from 'react'
import type { Bookmark } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { IconAlertCircle } from '@tabler/icons-react'
import { toast } from 'sonner'
import {
  BOOKMARKS_QUERY,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  NAV_ITEMS_COUNT_QUERY,
  TAG_ITEMS_QUERY,
  TAGS_QUERY,
} from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { cn, isAdminRole } from '@/lib/utils'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useProfile } from '@/hooks/use-profile'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/spinner'

interface SingleBookmark {
  bookmark: Bookmark
  bookmarks?: never
}

interface MultipleBookmarks {
  bookmark?: never
  bookmarks: Bookmark[]
}

type DeleteBookmarksDialogProps = SingleBookmark | MultipleBookmarks

const messages = {
  singleSuccess: 'Bookmark has been deleted.',
  singleFailure: 'Unable to delete bookmark at this time, try again.',
  multipleFailure: 'Some bookmarks failed to be deleted, try again.',
}

let completedCount = 0

export const DeleteBookmarksDialog = NiceModal.create(({ bookmark, bookmarks }: DeleteBookmarksDialogProps) => {
  const { data: profile } = useProfile()
  const modal = useModal()
  const supabase = createClient()
  const { invalidateQueries } = useInvalidateQueries()
  const [isLoading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  async function handleDeleteBookmarks(bookmarksToMove: Bookmark[]) {
    setLoading(true)
    setProgress(0)
    completedCount = 0

    const movePromises = bookmarksToMove.map((bk) =>
      supabase
        .from('bookmarks')
        .delete()
        .eq('id', bk.id)
        .then((result) => {
          if (result.error) throw new Error(result.error.message)
          completedCount++
          bookmarksToMove.length > 1 && setProgress((completedCount / totalOperations) * 100)
        }),
    )

    const totalOperations = movePromises.length
    const settledPromises = await Promise.allSettled(movePromises)
    const errors = settledPromises.filter((p) => p.status === 'rejected')

    if (errors.length > 0) {
      toast.error('Error', {
        description: movePromises.length > 1 ? messages.multipleFailure : messages.singleFailure,
      })
    } else {
      toast.success('Success', {
        description:
          completedCount > 1 ? (
            <>
              <span className="font-semibold">{completedCount}</span> bookmarks has been deleted.
            </>
          ) : (
            messages.singleSuccess
          ),
      })
    }

    await invalidateQueries([
      FOLDERS_QUERY,
      BOOKMARKS_QUERY,
      FOLDER_ITEMS_QUERY,
      TAG_ITEMS_QUERY,
      TAGS_QUERY,
      FAV_BOOKMARKS_QUERY,
      NAV_ITEMS_COUNT_QUERY,
    ])
    await modal.hide()
    setLoading(false)
    modal.remove()
  }

  return (
    <AlertDialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (isLoading) return
        isOpen ? modal.show() : modal.hide()
      }}
    >
      <AlertDialogContent
        className="max-w-lg transition-transform"
        onCloseAutoFocus={() => {
          modal.remove()
        }}
      >
        <div className="flex flex-col gap-2 p-4 pb-0 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="border-border flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden
          >
            <IconAlertCircle className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bookmarks && bookmarks.length > 1 ? 'Remove bookmarks?' : 'Remove bookmark?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bookmarks && bookmarks.length > 1 ? (
                <>
                  You are about to remove <span className="font-semibold">{bookmarks.length}</span> bookmarks.
                </>
              ) : (
                'You are about to remove this bookmark.'
              )}{' '}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {progress > 0 && <Progress value={progress} />}
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </AlertDialogCancel>
          {isAdminRole(profile?.user_role) && (
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={() => {
                void handleDeleteBookmarks(bookmark ? [bookmark] : bookmarks)
              }}
            >
              <span className={cn(isLoading && 'invisible')}>Proceed</span>
              {isLoading && <Spinner className="absolute" />}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})
