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
import { EditTagDialog } from '@/components/dialogs/tags/edit-tag'

export function SidebarItemActions({ tag }: { tag: Tables<'tags'> }) {
  const queryClient = useQueryClient()

  async function handleDeleteFolder(id: number) {
    const supabase = createClient()
    const { error } = await supabase.from('tags').delete().eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    toast.success('Success', {
      description: (
        <div>
          Folder <span className="font-semibold">{tag.name}</span> has been deleted.
        </div>
      ),
    })
    await queryClient.invalidateQueries({ queryKey: [FOLDERS_QUERY] })
    await queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] })
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
        <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 break-all p-0">{tag.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(EditTagDialog, {
              tag,
            })
          }}
        >
          <IconPencil className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            void NiceModal.show(AlertActionDialog, {
              message: 'This action will also delete all bookmarks related to this folder.',
              action: async () => {
                await handleDeleteFolder(tag.id)
              },
            })
          }}
        >
          <IconTrash className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
