import NiceModal from '@ebay/nice-modal-react'
import { IconDots, IconFolderPlus, IconPencil, IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'
import type { Tables } from '@/types/database.types'
import {
  BOOKMARKS_QUERY,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  TAG_ITEMS_QUERY,
} from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertActionDialog } from '@/components/dialogs/alert-action'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { EditFolderDialog } from '@/components/dialogs/folders/edit-folder'

export function SidebarItemActions({ folder }: { folder: Tables<'folders'> }) {
  const supabase = createClient()
  const { invalidateQueries } = useInvalidateQueries()

  async function handleDeleteFolder(id: string) {
    const { error } = await supabase.from('folders').delete().eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    toast.success('Success', {
      description: (
        <div>
          Folder <span className="font-semibold">{folder.name}</span> has been deleted.
        </div>
      ),
    })

    await invalidateQueries([FOLDERS_QUERY, BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY, FAV_BOOKMARKS_QUERY])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" type="button" variant="ghost">
          <span className="sr-only">Open folders actions</span>
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-52">
        <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 p-0 break-words">{folder.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(EditFolderDialog, {
              folder,
            })
          }}
        >
          <IconPencil className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(CreateFolderDialog, {
              parentFolderId: folder.id,
            })
          }}
        >
          <IconFolderPlus className="mr-2 size-4" />
          Create folder
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <AlertActionDialog
          destructive
          title="Delete folder?"
          message="It will also delete all bookmarks/folders related to this folder. This action cannot be undone."
          action={async () => await handleDeleteFolder(folder.id)}
          trigger={
            <DropdownMenuItem
              className="!text-destructive"
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <IconTrash className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
