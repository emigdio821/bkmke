import { useCallback, useState } from 'react'
import type { Bookmark } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BOOKMARKS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useFolders } from '@/hooks/use-folders'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from './spinner'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

interface MoveToFolderDialogProps {
  trigger?: React.ReactNode
  bookmark: Bookmark
}

export function MoveToFolderDialog({ trigger, bookmark }: MoveToFolderDialogProps) {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const [openDialog, setOpenDialog] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [selectValue, setSelectValue] = useState(`${bookmark.folder_id}`)
  const { data: folders, isLoading: foldersLoading } = useFolders()

  const handleMoveToFolder = useCallback(async () => {
    if (!selectValue) {
      toast.warning('Please, select a folder')
      return
    }

    if (selectValue === `${bookmark.folder_id}`) {
      setOpenDialog(false)
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
    setOpenDialog(false)
    setLoading(false)
  }, [bookmark.folder_id, bookmark.id, queryClient, selectValue, supabase])

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        !isLoading && setOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger || <Button variant="outline">Move to folder</Button>}</DialogTrigger>
      <DialogContent
        className="max-w-sm"
        aria-describedby={undefined}
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
}
