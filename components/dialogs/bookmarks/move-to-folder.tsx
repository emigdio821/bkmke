import { useCallback, useState } from 'react'
import type { Bookmark } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useFolders } from '@/hooks/use-folders'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/spinner'

interface SingleBookmark {
  bookmark: Bookmark
  bookmarks?: never
}

interface MultipleBookmarks {
  bookmark?: never
  bookmarks: Bookmark[]
}

type MoveToFolderDialogProps = SingleBookmark | MultipleBookmarks

const singleSuccessMessage = 'Bookmark has been moved.'
const singleFailureMessage = 'Unable to move bookmark at this time, try again.'
const multipleFailureMessage = 'Some bookmarks failed to move, try again.'

export const MoveToFolderDialog = NiceModal.create(({ bookmark, bookmarks }: MoveToFolderDialogProps) => {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const modal = useModal()
  const folderId =
    bookmark?.folder_id?.toString() || (bookmarks?.length === 1 ? bookmarks[0].folder_id?.toString() : '')
  const [isLoading, setLoading] = useState(false)
  const [selectValue, setSelectValue] = useState(folderId)
  const { data: folders, isLoading: foldersLoading } = useFolders()
  const bookmarkName = bookmark?.name || (bookmarks?.length === 1 ? bookmarks[0].name : 'Multiple bookmarks')
  const [progress, setProgress] = useState(0)

  const handleRefreshData = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] }),
      queryClient.invalidateQueries({ queryKey: [FOLDER_ITEMS_QUERY] }),
      queryClient.invalidateQueries({ queryKey: [TAG_ITEMS_QUERY] }),
    ])
  }, [queryClient])

  async function handleMoveToFolder(bookmarksToMove: Bookmark[]) {
    if (selectValue === folderId && bookmarksToMove.length === 1) {
      await modal.hide()
      return
    }

    setLoading(true)
    setProgress(0)
    const areMultipleBks = bookmarksToMove.length > 1
    let completedCount = 0

    const movePromises = bookmarksToMove.map((bk) =>
      supabase
        .from('bookmarks')
        .update({ folder_id: selectValue ? Number(selectValue) : null })
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
        description: areMultipleBks ? multipleFailureMessage : singleFailureMessage,
      })
    } else {
      await handleRefreshData()
      toast.success('Success', {
        description: areMultipleBks ? (
          <>
            <span className="font-semibold">{resultsArray.length}</span> bookmarks has been moved.
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
    <Dialog
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
      <DialogContent
        className="max-w-md"
        aria-describedby={undefined}
        onCloseAutoFocus={() => {
          modal.remove()
        }}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Move to folder</DialogTitle>
          <DialogDescription className="break-all">{bookmarkName}</DialogDescription>
        </DialogHeader>

        {foldersLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          folders &&
          folders.length > 0 && (
            <div className="space-y-2">
              <Label>
                Move to folder
                {selectValue && (
                  <>
                    <span className="text-muted-foreground"> · </span>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSelectValue('')
                      }}
                    >
                      Clear selection
                    </Button>
                  </>
                )}
              </Label>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={`${folder.id}-folder-select`} value={`${folder.id}`}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        )}
        {progress > 0 && <Progress value={progress} />}
        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => {
              void handleMoveToFolder(bookmark ? [bookmark] : bookmarks)
            }}
            disabled={isLoading}
          >
            Move {isLoading && <Spinner className="ml-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
