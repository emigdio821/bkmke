import { Fragment, useState } from 'react'
import type { Bookmark } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { IconChevronRight } from '@tabler/icons-react'
import { toast } from 'sonner'
import {
  BOOKMARKS_QUERY,
  DEMO_ROLE,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  TAG_ITEMS_QUERY,
} from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
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

const messages = {
  singleSuccess: 'Bookmark has been moved.',
  singleFailure: 'Unable to move bookmark at this time, try again.',
  multipleFailure: 'Some bookmarks failed to move, try again.',
}

export const MoveToFolderDialog = NiceModal.create(({ bookmark, bookmarks }: MoveToFolderDialogProps) => {
  const { data: profile } = useProfile()
  const appMetadata = profile?.app_metadata
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

    const completedCount = { count: 0 }
    setLoading(true)
    setProgress(0)

    const movePromises = bookmarksToMove.map((bk) =>
      supabase
        .from('bookmarks')
        .update({ folder_id: selectValue || null })
        .eq('id', bk.id)
        .then((result) => {
          if (result.error) throw new Error(result.error.message)
          completedCount.count++
          bookmarksToMove.length > 1 && setProgress((completedCount.count / totalOperations) * 100)
        }),
    )

    const totalOperations = movePromises.length
    const areMultipleBks = completedCount.count > 1
    const settledPromises = await Promise.allSettled(movePromises)
    const errors = settledPromises.filter((p) => p.status === 'rejected')

    if (errors.length > 0) {
      toast.error('Error', {
        description: areMultipleBks ? messages.multipleFailure : messages.singleFailure,
      })
    } else {
      toast.success('Success', {
        description: areMultipleBks ? `${completedCount.count} bookmarks have been moved.` : messages.singleSuccess,
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
        className="max-w-md"
        aria-describedby={undefined}
        onCloseAutoFocus={() => {
          modal.remove()
        }}
      >
        <DialogHeader>
          <DialogTitle>Move to folder</DialogTitle>
          <DialogDescription className="break-words">{bookmarkName}</DialogDescription>
        </DialogHeader>

        {foldersLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          folders &&
          folders.length > 0 && (
            <div className="space-y-2">
              <Label>
                Folder
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
                    <Fragment key={`parent-folder-${folder.id}`}>
                      <SelectItem value={`${folder.id}`}>{folder.name}</SelectItem>
                      {folder.children.map((subfolder) => (
                        <SelectItem key={`subfolder-${subfolder.id}`} value={`${subfolder.id}`}>
                          <span className="flex items-center">
                            <span className="text-xs text-muted-foreground">{folder.name}</span>
                            <IconChevronRight className="size-3.5 text-muted-foreground" />
                            {subfolder.name}
                          </span>
                        </SelectItem>
                      ))}
                    </Fragment>
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
            disabled={isLoading || appMetadata?.userrole === DEMO_ROLE}
            onClick={() => handleMoveToFolder(bookmarks ? bookmarks : [bookmark])}
          >
            <span className={cn(isLoading && 'invisible')}>Move</span>
            {isLoading && <Spinner className="absolute" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
