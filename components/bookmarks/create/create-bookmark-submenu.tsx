import React from 'react'
import { IconPencil, IconWand } from '@tabler/icons-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { CreateAutomaticBookmarkDialog } from './create-automatic-dialog'
import { CreateManualBookmarkDialog } from './create-manual-dialog'

export function CreateBookmarkSubmenu() {
  return (
    <>
      <CreateManualBookmarkDialog
        trigger={
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
            }}
          >
            <IconPencil className="mr-2 size-4" />
            Manual
          </DropdownMenuItem>
        }
      />
      <CreateAutomaticBookmarkDialog
        trigger={
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
            }}
          >
            <IconWand className="mr-2 size-4" />
            Automatic
          </DropdownMenuItem>
        }
      />
    </>
  )
}
