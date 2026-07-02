import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import type { TagWithBookmarkCount } from '@/db/schema/zod/tags'
import { deleteTag } from '@/api/server-functions/tags'
import { TAGS_QUERY_KEY } from '@/api/tanstack-queries/tags'
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
import { EditTagDialog } from './dialogs/edit'

interface TagsActionsCtxMenuProps extends React.ComponentProps<typeof ContextMenu> {
  tag: TagWithBookmarkCount
  trigger: React.ReactElement
}

export function TagsActionsCtxMenu({ tag, trigger }: TagsActionsCtxMenuProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const deleteTagMutation = useEntityMutation({
    mutationFn: async (id: string) => {
      return await deleteTag({ data: id })
    },
    invalidateKeys: [TAGS_QUERY_KEY],
    successDescription: 'The tag has been deleted.',
    errorDescription: 'An error occurred while deleting the tag, please try again.',
    onSuccess: () => {
      setDeleteDialogOpen(false)
    },
  })

  async function handleDeleteTag() {
    await deleteTagMutation.mutateAsync(tag.id)
  }

  return (
    <>
      <AlertDialogGeneric
        variant="destructive"
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        action={handleDeleteTag}
        title="Delete tag?"
        description={
          <div>
            You are about to delete the tag: "<span className="font-medium">{tag.name}</span>". This action
            cannot be undone.
          </div>
        }
      />

      <EditTagDialog tag={tag} open={isEditDialogOpen} onOpenChange={setEditDialogOpen} />

      <ContextMenu>
        <ContextMenuTrigger>{trigger}</ContextMenuTrigger>
        <ContextMenuPopup>
          <ContextMenuGroup>
            <ContextMenuGroupLabel>{tag.name}</ContextMenuGroupLabel>
            <ContextMenuItem onClick={() => setEditDialogOpen(true)}>
              <IconEdit />
              Edit
            </ContextMenuItem>
            <ContextMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <IconTrash /> Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuPopup>
      </ContextMenu>
    </>
  )
}
