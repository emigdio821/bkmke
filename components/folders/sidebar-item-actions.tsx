import { Edit2Icon, FolderPlusIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
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
import { areModificationsEnabled } from '@/lib/utils'
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
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-52">
        <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 p-0 break-words">{folder.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <EditFolderDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <Edit2Icon className="size-4" />
              Edit
            </DropdownMenuItem>
          }
          folder={folder}
        />
        <CreateFolderDialog
          parentFolderId={folder.id}
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <FolderPlusIcon className="size-4" />
              Create folder
            </DropdownMenuItem>
          }
        />

        {areModificationsEnabled() && (
          <>
            <DropdownMenuSeparator />
            <AlertActionDialog
              destructive
              title="Delete folder?"
              message="It will also delete all bookmarks/folders related to this folder. This action cannot be undone."
              action={async () => await handleDeleteFolder(folder.id)}
              trigger={
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => {
                    e.preventDefault()
                  }}
                >
                  <Trash2Icon className="size-4" />
                  Delete
                </DropdownMenuItem>
              }
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
