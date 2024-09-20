import { useCallback, useState } from 'react'
import type { Bookmark } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BOOKMARKS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useFolders } from '@/hooks/use-folders'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/spinner'

interface MoveToFolderDialogProps {
  bookmark: Bookmark
}

export const MoveToFolderDialog = NiceModal.create(({ bookmark }: MoveToFolderDialogProps) => {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const modal = useModal()
  const [isLoading, setLoading] = useState(false)
  const [selectValue, setSelectValue] = useState(`${bookmark.folder_id}`)
  const { data: folders, isLoading: foldersLoading } = useFolders()

  const handleMoveToFolder = useCallback(async () => {
    if (!selectValue) {
      toast.warning('Please, select a folder')
      return
    }

    if (selectValue === `${bookmark.folder_id}`) {
      await modal.hide()
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('bookmarks')
      .update({ folder_id: Number(selectValue) })
      .eq('id', bookmark.id)

    if (error) {
      setLoading(false)
      toast.error('Error', { description: error.message })
      return
    }

    await queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] })
    toast.success('Success', { description: 'Bookmark has been moved to selected folder' })
    await modal.hide()
    setLoading(false)
  }, [bookmark.folder_id, bookmark.id, modal, queryClient, selectValue, supabase])

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          void modal.show()
        } else {
          void modal.hide()
        }
      }}
    >
      <DialogContent
        className="max-w-sm"
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
          <DialogDescription>{bookmark.name}</DialogDescription>
        </DialogHeader>

        {foldersLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          folders &&
          folders.length > 0 && (
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
          )
        )}

        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              void handleMoveToFolder()
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
