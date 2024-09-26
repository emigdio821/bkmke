import NiceModal from '@ebay/nice-modal-react'
import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Tables } from '@/types/database.types'
import { BOOKMARKS_QUERY, FOLDERS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
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
import { EditFolderDialog } from '@/components/dialogs/folders/edit-folder'

export function SidebarItemActions({ folder }: { folder: Tables<'folders'> }) {
  const queryClient = useQueryClient()

  async function handleDeleteFolder(id: number) {
    const supabase = createClient()
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
    await queryClient.invalidateQueries({ queryKey: [FOLDERS_QUERY] })
    await queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" type="button" variant="ghost" className="data-[state=open]:bg-accent">
          <span className="sr-only">Open folders actions</span>
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-52">
        <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 break-all p-0">{folder.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(EditFolderDialog, {
              folder,
            })
          }}
        >
          <IconPencil className="mr-2 size-4 text-muted-foreground" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            void NiceModal.show(AlertActionDialog, {
              message: 'It will also delete all bookmarks related to this folder. This action cannot be undone.',
              action: async () => {
                await handleDeleteFolder(folder.id)
              },
            })
          }}
        >
          <IconTrash className="mr-2 size-4 text-destructive/70" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
