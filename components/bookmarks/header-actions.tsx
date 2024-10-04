import type { Bookmark } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import { IconFolderShare, IconReload, IconTags, IconTrash } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY } from '@/lib/constants'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DeleteBookmarksDialog } from '@/components/dialogs/bookmarks/delete'
import { MoveToFolderDialog } from '@/components/dialogs/bookmarks/move-to-folder'
import { UpdateTagsDialog } from '@/components/dialogs/bookmarks/update-tags'

export function DataTableHeaderActions({ table }: { table: Table<Bookmark> }) {
  const { invalidateQueries } = useInvalidateQueries()
  const selectedRows = table.getSelectedRowModel().rows

  async function handleReloadTableData() {
    const promise = invalidateQueries([BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY])

    toast.promise(promise, {
      loading: 'Reloading table data...',
      success: 'Table data reloaded.',
      error: 'Unable to reload data at this time, try again.',
    })
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      {selectedRows.length > 0 && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                type="button"
                variant="outline"
                onClick={() => {
                  void NiceModal.show(DeleteBookmarksDialog, {
                    bookmarks: selectedRows.map((row) => row.original),
                  })
                }}
              >
                <IconTrash className="size-4" />
                <span className="sr-only">Delete selected rows</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete selected rows</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                type="button"
                variant="outline"
                onClick={() => {
                  void NiceModal.show(UpdateTagsDialog, {
                    bookmarks: selectedRows.map((row) => row.original),
                  })
                }}
              >
                <IconTags className="size-4" />
                <span className="sr-only">Update selected rows tags</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Update selected rows tags</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                type="button"
                variant="outline"
                onClick={() => {
                  void NiceModal.show(MoveToFolderDialog, {
                    bookmarks: selectedRows.map((row) => row.original),
                  })
                }}
              >
                <IconFolderShare className="size-4" />
                <span className="sr-only">Move selected rows to folder</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move selected rows to folder</TooltipContent>
          </Tooltip>
        </>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            type="button"
            variant="outline"
            onClick={() => {
              void handleReloadTableData()
            }}
          >
            <IconReload className="size-4" />
            <span className="sr-only">Reload table data</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reload table data</TooltipContent>
      </Tooltip>
    </div>
  )
}
