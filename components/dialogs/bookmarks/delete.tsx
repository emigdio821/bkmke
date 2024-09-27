import { useCallback, useState } from 'react'
import type { Bookmark } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
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

const singleSuccessMessage = 'Bookmark has been deleted.'
const singleFailureMessage = 'Unable to delete bookmark at this time, try again.'
const multipleFailureMessage = 'Some bookmarks failed to be deleted, try again.'

export const DeleteBookmarksDialog = NiceModal.create(({ bookmark, bookmarks }: DeleteBookmarksDialogProps) => {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const modal = useModal()
  const [isLoading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleRefreshData = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] }),
      queryClient.invalidateQueries({ queryKey: [FOLDER_ITEMS_QUERY] }),
      queryClient.invalidateQueries({ queryKey: [TAG_ITEMS_QUERY] }),
    ])
  }, [queryClient])

  async function handleDeleteBookmarks(bookmarksToMove: Bookmark[]) {
    setLoading(true)
    setProgress(0)
    const areMultipleBks = bookmarksToMove.length > 1
    let completedCount = 0

    const movePromises = bookmarksToMove.map((bk) =>
      supabase
        .from('bookmarks')
        .delete()
        .eq('id', bk.id)
        .then((result) => {
          completedCount++
          setProgress((completedCount / totalOperations) * 100)
          if (result.error) {
            throw new Error(result.error.message)
          }
        }),
    )

    const totalOperations = movePromises.length
    const settledPromises = await Promise.allSettled(movePromises)

    setProgress((completedCount / totalOperations) * 100)

    const resultsArray = []
    const errorsArray = []

    for (const promise of settledPromises) {
      if (promise.status === 'fulfilled') {
        resultsArray.push(promise.value)
      } else {
        errorsArray.push(promise.reason)
      }
    }

    if (errorsArray.length > 0) {
      toast.error('Error', {
        description: movePromises.length > 1 ? multipleFailureMessage : singleFailureMessage,
      })
    } else {
      await handleRefreshData()
      toast.success('Success', {
        description: areMultipleBks ? (
          <>
            <span className="font-semibold">{resultsArray.length}</span> bookmarks has been deleted.
          </>
        ) : (
          singleSuccessMessage
        ),
      })
    }

    await modal.hide()
    setLoading(false)
    modal.remove()
  }

  return (
    <AlertDialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (isLoading) return
        if (isOpen) {
          void modal.show()
        } else {
          void modal.hide()
        }
      }}
    >
      <AlertDialogContent
        className="max-w-lg transition-transform"
        aria-describedby={undefined}
        onCloseAutoFocus={() => {
          modal.remove()
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            {bookmarks && bookmarks.length > 1 ? 'Remove bookmarks?' : 'Remove bookmark?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="break-all">
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

        {progress > 0 && <Progress value={progress} />}
        <AlertDialogFooter className="pt-6">
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={() => {
              void handleDeleteBookmarks(bookmark ? [bookmark] : bookmarks)
            }}
            disabled={isLoading}
          >
            Proceed {isLoading && <Spinner className="ml-2" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})
