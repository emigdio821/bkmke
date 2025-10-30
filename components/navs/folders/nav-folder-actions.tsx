import type { Folder } from '@/types'
import { Edit2Icon, FolderPlusIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { AlertActionDialog } from '@/components/dialogs/alert-action'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { EditFolderDialog } from '@/components/dialogs/folders/edit-folder'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuAction } from '@/components/ui/sidebar'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { createClient } from '@/lib/supabase/client'
import { BOOKMARKS_QUERY_KEY, FAV_BOOKMARKS_QUERY_KEY } from '@/lib/ts-queries/bookmarks'
import { FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'

interface NavFolderActionsProps {
  folder: Folder
  className?: string
}

export function NavFolderActions({ folder, className }: NavFolderActionsProps) {
  const modEnabled = useModEnabled()
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

    const queryKeysToInvalidate = [[BOOKMARKS_QUERY_KEY], [BOOKMARKS_QUERY_KEY, FAV_BOOKMARKS_QUERY_KEY]]

    await invalidateQueries([[FOLDERS_QUERY_KEY], [TAGS_QUERY_KEY]], { exact: false })
    await invalidateQueries(queryKeysToInvalidate)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction className={className}>
          <MoreHorizontalIcon />
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 p-0 wrap-break-word">{folder.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <EditFolderDialog
          folder={folder}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit2Icon className="size-4" />
              Edit
            </DropdownMenuItem>
          }
        />
        <CreateFolderDialog
          parentFolderId={folder.id}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <FolderPlusIcon className="size-4" />
              Create folder
            </DropdownMenuItem>
          }
        />
        {modEnabled && (
          <>
            <DropdownMenuSeparator />
            <AlertActionDialog
              destructive
              title="Delete folder?"
              message="It will also delete all bookmarks/folders related to this folder. This action cannot be undone."
              action={async () => await handleDeleteFolder(folder.id)}
              trigger={
                <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
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
