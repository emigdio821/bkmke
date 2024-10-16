import type { Bookmark } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import { IconFolderShare, IconTags, IconTrash } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DeleteBookmarksDialog } from '@/components/dialogs/bookmarks/delete'
import { MoveToFolderDialog } from '@/components/dialogs/bookmarks/move-to-folder'
import { UpdateTagsDialog } from '@/components/dialogs/bookmarks/update-tags'

export function DataTableHeaderActions({ table }: { table: Table<Bookmark> }) {
  const selectedRows = table.getSelectedRowModel().rows

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
                <span className="sr-only">Delete items</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete items</TooltipContent>
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
                <span className="sr-only">Update tags</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Update tags</TooltipContent>
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
                <span className="sr-only">Move to folder</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to folder</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  )
}
