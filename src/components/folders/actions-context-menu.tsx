import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { deleteFolder, type FolderTreeNode } from '@/api/server-functions/folders'
import { FOLDERS_QUERY_KEY } from '@/api/tanstack-queries/folders'
import { useEntityMutation } from '@/hooks/use-entity-mutation'
import { AlertDialogGeneric } from '../shared/alert-dialog-generic'
import {
  ContextMenu,
  ContextMenuPopup,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuGroupLabel,
  ContextMenuTrigger,
} from '../ui/context-menu'
import { EditFolderDialog } from './dialogs/edit'

interface ActionsProps {
  folder: FolderTreeNode
  trigger?: React.ReactElement
}

export function FolderActionsCtxMenu({ folder, trigger }: ActionsProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const deleteFolderMutation = useEntityMutation({
    mutationFn: async (id: string) => {
      return await deleteFolder({ data: id })
    },
    invalidateKeys: [FOLDERS_QUERY_KEY],
    successDescription: 'The folder has been deleted.',
    errorDescription: 'An error occurred while deleting the folder, please try again.',
    onSuccess: () => {
      setDeleteDialogOpen(false)
    },
  })

  async function handleDeleteFolder() {
    await deleteFolderMutation.mutateAsync(folder.id)
  }

  return (
    <>
      <AlertDialogGeneric
        variant="destructive"
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        action={handleDeleteFolder}
        title="Delete folder?"
        description={
          <div>
            You are about to delete the folder: "<span className="font-medium">{folder.name}</span>". This
            action cannot be undone.
          </div>
        }
      />

      <EditFolderDialog folder={folder} open={isEditDialogOpen} onOpenChange={setEditDialogOpen} />

      <ContextMenu>
        <ContextMenuTrigger>{trigger}</ContextMenuTrigger>
        <ContextMenuPopup>
          <ContextMenuGroup>
            <ContextMenuGroupLabel>{folder.name}</ContextMenuGroupLabel>
            <ContextMenuItem onClick={() => setEditDialogOpen(true)}>
              <PencilIcon />
              Edit
            </ContextMenuItem>
            <ContextMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2Icon /> Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuPopup>
      </ContextMenu>
    </>
  )
}
