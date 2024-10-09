import NiceModal from '@ebay/nice-modal-react'
import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'
import type { Tables } from '@/types/database.types'
import { BOOKMARKS_QUERY, FAV_BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY, TAGS_QUERY } from '@/lib/constants'
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
import { EditTagDialog } from '@/components/dialogs/tags/edit-tag'

export function SidebarItemActions({ tag }: { tag: Tables<'tags'> }) {
  const { invalidateQueries } = useInvalidateQueries()

  async function handleDeleteFolder(id: number) {
    const supabase = createClient()
    const { error } = await supabase.from('tags').delete().eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    toast.success('Success', {
      description: (
        <div>
          Tag <span className="font-semibold">{tag.name}</span> has been deleted.
        </div>
      ),
    })

    await invalidateQueries([TAGS_QUERY, BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY, FAV_BOOKMARKS_QUERY])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" type="button" variant="ghost">
          <span className="sr-only">Open tag actions</span>
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
          <IconPencil className="mr-2 size-4 text-muted-foreground" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            void NiceModal.show(AlertActionDialog, {
              title: 'Delete tag?',
              message: 'It will also unlik all bookmarks related to this tag. This action cannot be undone.',
              action: async () => {
                await handleDeleteFolder(tag.id)
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
