import { useMemo, useState } from 'react'
import type { Bookmark } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import type { PostgrestError } from '@supabase/postgrest-js'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

interface UpdateTagsDialogProps {
  bookmark: Bookmark
}

export const UpdateTagsDialog = NiceModal.create(({ bookmark }: UpdateTagsDialogProps) => {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const modal = useModal()
  const tagItems = bookmark.tag_items
    .map((item) => item.tags?.id)
    .filter((id) => id !== undefined)
    .map((id) => id.toString())
  const [isLoading, setLoading] = useState(false)
  const [selectValue, setSelectValue] = useState<string[]>(tagItems)
  const { data: tags, isLoading: tagsLoading } = useTags()

  const getTagsData = useMemo(() => {
    const data = []
    if (tags) {
      for (const tag of tags) {
        data.push({
          label: tag.name,
          value: tag.id.toString(),
        })
      }
    }

    return data
  }, [tags])

  function handleError(error: PostgrestError) {
    setLoading(false)
    toast.error('Error', { description: error.message })
  }

  async function handleUpdateTags() {
    setLoading(true)

    if (selectValue.length > 0) {
      const bookmarkId = bookmark.id
      const tagItemsPayload = selectValue.map((tagId) => ({
        bookmark_id: bookmarkId,
        tag_id: Number(tagId),
      }))

      const { error } = await supabase.from('tag_items').upsert(tagItemsPayload, { onConflict: 'bookmark_id, tag_id' })
      if (error) {
        handleError(error)
        return
      }

      const remainingTags = selectValue.map((tagId) => Number(tagId)).join(',')
      const { error: deleteRemainingsErr } = await supabase
        .from('tag_items')
        .delete()
        .eq('bookmark_id', bookmarkId)
        .not('tag_id', 'in', `(${remainingTags})`)
      if (deleteRemainingsErr) {
        handleError(deleteRemainingsErr)
        return
      }
    } else {
      const { error } = await supabase.from('tag_items').delete().eq('bookmark_id', bookmark.id)
      if (error) {
        handleError(error)
        return
      }
    }

    await queryClient.invalidateQueries({ queryKey: [BOOKMARKS_QUERY] })
    await queryClient.invalidateQueries({ queryKey: [FOLDER_ITEMS_QUERY] })
    await queryClient.invalidateQueries({ queryKey: [TAG_ITEMS_QUERY] })
    toast.success('Success', { description: 'Tags has been updated.' })
    await modal.hide()
    setLoading(false)
  }

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          void modal.show()
        } else {
          void modal.hide()
        }
      }}
    >
      <DialogContent
        className="max-w-md"
        aria-describedby={undefined}
        onCloseAutoFocus={() => {
          modal.remove()
        }}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Update tags</DialogTitle>
          <DialogDescription className="break-all">{bookmark.name}</DialogDescription>
        </DialogHeader>

        {tagsLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          tags &&
          tags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <MultiSelect
                placeholder="Select tags"
                value={tagItems}
                options={getTagsData}
                emptyText="No tags yet"
                onChange={(options) => {
                  setSelectValue(options)
                }}
              />
            </div>
          )
        )}

        <DialogFooter className="pt-6">
          <Button
            type="button"
            onClick={() => {
              void handleUpdateTags()
            }}
            disabled={isLoading}
          >
            Update {isLoading && <Spinner className="ml-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
