import { useState } from 'react'
import type { Bookmark } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { toast } from 'sonner'
import {
  BOOKMARKS_QUERY,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  TAG_ITEMS_QUERY,
} from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { cn, isAdminRole } from '@/lib/utils'
import { useFolders } from '@/hooks/use-folders'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useProfile } from '@/hooks/use-profile'
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
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { FolderSelectItems } from '@/components/folders/folder-select-items'
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

const messages = {
  singleSuccess: 'Bookmark has been moved.',
  singleFailure: 'Unable to move bookmark at this time, try again.',
  multipleFailure: 'Some bookmarks failed to move, try again.',
}

let completedCount = 0

export const MoveToFolderDialog = NiceModal.create(({ bookmark, bookmarks }: MoveToFolderDialogProps) => {
  const { data: profile } = useProfile()
  const supabase = createClient()
  const modal = useModal()
  const initialFolderId =
    bookmark?.folder_id?.toString() || (bookmarks?.length === 1 ? bookmarks[0].folder_id?.toString() : '')

  const [isLoading, setLoading] = useState(false)
  const { invalidateQueries } = useInvalidateQueries()
  const [selectValue, setSelectValue] = useState(initialFolderId)
  const { data: folders, isLoading: foldersLoading } = useFolders()
  const bookmarkName = bookmark?.name || (bookmarks?.length === 1 ? bookmarks[0].name : 'Multiple bookmarks')
  const [progress, setProgress] = useState(0)

  async function handleMoveToFolder(bookmarksToMove: Bookmark[]) {
    if (selectValue === initialFolderId && bookmarksToMove.length === 1) {
      await modal.hide()
      return
    }

    setLoading(true)
    setProgress(0)
    completedCount = 0

    const movePromises = bookmarksToMove.map((bk) =>
      supabase
        .from('bookmarks')
        .update({ folder_id: selectValue || null })
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
        description: completedCount > 1 ? messages.multipleFailure : messages.singleFailure,
      })
    } else {
      toast.success('Success', {
        description: completedCount > 1 ? `${completedCount} bookmarks have been moved.` : messages.singleSuccess,
      })
    }

    await invalidateQueries([FOLDERS_QUERY, BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY, FAV_BOOKMARKS_QUERY])
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
        className="sm:max-w-sm"
        onCloseAutoFocus={() => {
          modal.remove()
        }}
      >
        <DialogHeader>
          <DialogTitle>Move to folder</DialogTitle>
          <DialogDescription className="break-words">{bookmarkName}</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto p-4">
          {foldersLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            folders &&
            folders.length > 0 && (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="select-folder">Folder</Label>
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
                </div>
                <div>
                  <Select value={selectValue} onValueChange={setSelectValue}>
                    <SelectTrigger id="select-folder">
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <FolderSelectItems folders={folders} />
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )
          )}

          {progress > 0 && <Progress value={progress} />}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          {isAdminRole(profile?.user_role) && (
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => handleMoveToFolder(bookmarks ? bookmarks : [bookmark])}
            >
              <span className={cn(isLoading && 'invisible')}>Move</span>
              {isLoading && <Spinner className="absolute" />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
