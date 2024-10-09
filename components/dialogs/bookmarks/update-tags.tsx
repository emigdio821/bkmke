import { useState } from 'react'
import type { Bookmark } from '@/types'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { toast } from 'sonner'
import {
  BOOKMARKS_QUERY,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  TAG_ITEMS_QUERY,
} from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'

interface SingleBookmark {
  bookmark: Bookmark
  bookmarks?: never
}

interface MultipleBookmarks {
  bookmark?: never
  bookmarks: Bookmark[]
}

type UpdateTagsDialogProps = SingleBookmark | MultipleBookmarks

export const UpdateTagsDialog = NiceModal.create(({ bookmark, bookmarks }: UpdateTagsDialogProps) => {
  const modal = useModal()
  const supabase = createClient()
  const [isLoading, setLoading] = useState(false)
  const { invalidateQueries } = useInvalidateQueries()
  const [selectValue, setSelectValue] = useState<string[]>(getInitialItems())
  const { data: tags, isLoading: tagsLoading } = useTags()
  const [progress, setProgress] = useState(0)

  const bookmarkName = bookmark?.name || (bookmarks?.length === 1 ? bookmarks[0].name : 'Multiple bookmarks')

  function getInitialItems() {
    const items = bookmark?.tag_items || (bookmarks?.length === 1 ? bookmarks[0].tag_items : [])
    return items
      .map((item) => item.tag?.id)
      .filter((id) => id !== undefined)
      .map((id) => id.toString())
  }

  async function handleTagUpdate(bookmarksToUpdate: Bookmark[], isDelete: boolean) {
    const completedCount = { count: 0 }
    const totalOperations = bookmarksToUpdate.length

    const updatePromises = bookmarksToUpdate.map(async (bk) => {
      return await Promise.allSettled(
        selectValue.map(async (tagId) => {
          const { error } = await supabase.from('tag_items').upsert(
            {
              bookmark_id: bk.id,
              tag_id: Number(tagId),
            },
            { onConflict: 'bookmark_id, tag_id' },
          )

          if (isDelete) {
            const remainingTags = selectValue.join(',')
            await supabase.from('tag_items').delete().eq('bookmark_id', bk.id).not('tag_id', 'in', `(${remainingTags})`)
          }

          if (error) throw new Error(error.message)
          completedCount.count++
          setProgress((completedCount.count / totalOperations) * 100)
        }),
      )
    })

    const settledPromises = await Promise.allSettled(updatePromises)
    const errors = settledPromises.filter((p) => p.status === 'rejected')

    if (errors.length > 0) {
      toast.error('Error', { description: 'Unable to update tags at this time, try again.' })
    } else {
      await invalidateQueries([
        FOLDERS_QUERY,
        BOOKMARKS_QUERY,
        FOLDER_ITEMS_QUERY,
        TAG_ITEMS_QUERY,
        FAV_BOOKMARKS_QUERY,
      ])
      toast.success('Success', { description: 'Tags have been updated.' })
    }
  }

  const handleUpdateTags = async (bookmarksToUpdate: Bookmark[]) => {
    if (
      bookmarksToUpdate.length === 1 &&
      JSON.stringify(bookmarksToUpdate[0].tag_items) === JSON.stringify(selectValue)
    ) {
      await modal.hide()
      return
    }

    setLoading(true)
    setProgress(0)
    await handleTagUpdate(bookmarksToUpdate, selectValue.length > 0)
    await modal.hide()
    setLoading(false)
    modal.remove()
  }

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (isLoading) return
        if (isOpen) {
          void modal.show()
        } else {
          void modal.hide()
        }
      }}
    >
      <DialogContent
        className="max-w-md"
        onCloseAutoFocus={() => {
          modal.remove()
        }}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Update tags</DialogTitle>
          <DialogDescription className="break-all">{bookmarkName}</DialogDescription>
        </DialogHeader>

        {tagsLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <div className="space-y-2">
            <Label>Tags</Label>
            {tags && (
              <MultiSelect
                value={selectValue}
                emptyText="No tags yet"
                placeholder="Select tags"
                onChange={setSelectValue}
                options={tags.map((tag) => ({ value: `${tag.id}`, label: tag.name }))}
              />
            )}
          </div>
        )}

        {progress > 0 && <Progress value={progress} />}
        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => {
              void handleUpdateTags(bookmark ? [bookmark] : bookmarks)
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
