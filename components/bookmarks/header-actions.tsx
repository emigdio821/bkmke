import type { Bookmark } from '@/types'
import type { Table } from '@tanstack/react-table'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FolderIcon, RotateCwIcon, TagIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AlertActionDialog } from '@/components/dialogs/alert-action'
import { MoveToFolderDialog } from '@/components/dialogs/bookmarks/move-to-folder'
import { UpdateTagsDialog } from '@/components/dialogs/bookmarks/update-tags'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { deleteBookmark } from '@/lib/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/lib/ts-queries/bookmarks'
import { FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { SIDEBAR_ITEM_COUNT_QUERY_KEY } from '@/lib/ts-queries/sidebar'
import { TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'
import { Progress } from '../ui/progress'

interface DataTableHeaderActionsProps {
  table: Table<Bookmark>
  refetch: () => void
}

const QUERY_KEYS_TO_INVALIDATE = [
  [BOOKMARKS_QUERY_KEY],
  [SIDEBAR_ITEM_COUNT_QUERY_KEY],
  [FOLDERS_QUERY_KEY],
  [TAGS_QUERY_KEY],
]

export function DataTableHeaderActions({ table, refetch }: DataTableHeaderActionsProps) {
  const modEnabled = useModEnabled()
  const queryClient = useQueryClient()
  const [progress, setProgress] = useState(0)
  const selectedRows = table.getSelectedRowModel().rows
  const selectedBookmarkIds = selectedRows.map((row) => row.original.id)

  const { mutateAsync: removeBookmarksMutation } = useMutation({
    mutationFn: async () => {
      const total = selectedBookmarkIds.length
      let completed = 0

      for (const bookmarkId of selectedBookmarkIds) {
        await deleteBookmark(bookmarkId)
        completed++
        setProgress((completed / total) * 100)
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS_TO_INVALIDATE })

      toast.success('Success', {
        description: 'Selected bookmarks have been removed.',
      })

      table.resetRowSelection()
      setProgress(0)
    },
    onError: (error) => {
      console.error('Unable to remove bookmarks', error)
      toast.error('Error', { description: 'Unable to remove bookmarks at this time, try again.' })
      setProgress(0)
    },
  })

  return (
    <div className="flex items-center gap-2">
      {selectedRows.length > 0 && (
        <>
          {modEnabled && (
            <Tooltip>
              <AlertActionDialog
                destructive
                title="Delete selected bookmarks?"
                message={
                  <>
                    <div>
                      Selected bookmarks: <span className="font-semibold">{selectedRows.length}</span>
                    </div>
                    {progress > 0 && <Progress className="mt-4" value={progress} />}
                  </>
                }
                action={async () => await removeBookmarksMutation()}
                trigger={
                  <TooltipTrigger asChild>
                    <Button size="icon-sm" type="button" variant="outline">
                      <Trash2Icon className="size-4" />
                      <span className="sr-only">Delete selected items</span>
                    </Button>
                  </TooltipTrigger>
                }
              />
              <TooltipContent>Delete selected items</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <UpdateTagsDialog
              bookmarks={selectedRows.map((row) => row.original)}
              trigger={
                <TooltipTrigger asChild>
                  <Button size="icon-sm" type="button" variant="outline">
                    <TagIcon className="size-4" />
                    <span className="sr-only">Update tags</span>
                  </Button>
                </TooltipTrigger>
              }
            />
            <TooltipContent>Update tags</TooltipContent>
          </Tooltip>

          <Tooltip>
            <MoveToFolderDialog
              bookmarks={selectedRows.map((row) => row.original)}
              trigger={
                <TooltipTrigger asChild>
                  <Button size="icon-sm" type="button" variant="outline">
                    <FolderIcon className="size-4" />
                    <span className="sr-only">Move to folder</span>
                  </Button>
                </TooltipTrigger>
              }
            />
            <TooltipContent>Move to folder</TooltipContent>
          </Tooltip>
        </>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon-sm" type="button" onClick={refetch} variant="outline">
            <RotateCwIcon className="size-4" />
            <span className="sr-only">Refetch data</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refetch data</TooltipContent>
      </Tooltip>
    </div>
  )
}
