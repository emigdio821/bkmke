import type { Bookmark } from '@/types'
import type { Table } from '@tanstack/react-table'
import { FolderIcon, RotateCwIcon, TagIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { AlertActionDialog } from '@/components/dialogs/alert-action'
import { MoveToFolderDialog } from '@/components/dialogs/bookmarks/move-to-folder'
import { UpdateTagsDialog } from '@/components/dialogs/bookmarks/update-tags'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useRemoveBookmarks } from '@/hooks/bookmarks/use-remove-bookmarks'
import { useModEnabled } from '@/hooks/use-mod-enabled'

interface DataTableHeaderActionsProps {
  table: Table<Bookmark>
  refetch: () => void
}

export function DataTableHeaderActions({ table, refetch }: DataTableHeaderActionsProps) {
  const modEnabled = useModEnabled()
  const selectedRows = table.getSelectedRowModel().rows
  const { handleRemoveBookmarks, progress, errors } = useRemoveBookmarks()

  async function handleRemoveBks() {
    try {
      await handleRemoveBookmarks(selectedRows.map((row) => row.original))
      table.toggleAllRowsSelected(false)
      if (errors && errors.length > 0) throw new Error('Unable to remove some bookmarks')

      toast.success('Success', {
        description: 'Selected bookmarks have been removed.',
      })
    } catch (err) {
      console.error('Unable to remove selected bookmarks', err)
      const errMsg =
        errors && errors.length > 0
          ? 'Unable to remove some bookmarks, try again.'
          : 'Unable to remove selected bookmarks at this time, try again.'
      toast.error('Error', { description: errMsg })
    }
  }

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
                action={async () => await handleRemoveBks()}
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
