import { useState } from 'react'
import type { Bookmark } from '@/types'
import { toast } from 'sonner'
import {
  BOOKMARKS_QUERY,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  TAG_ITEMS_QUERY,
  TAGS_QUERY,
} from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useTags } from '@/hooks/tags/use-tags'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

type UpdateTagsDialogProps = (SingleBookmark | MultipleBookmarks) & {
  trigger: React.ReactNode
}

let completedCount = 0

export function UpdateTagsDialog({ bookmark, bookmarks, trigger }: UpdateTagsDialogProps) {
  const modEnabled = useModEnabled()
  const [openDialog, setOpenDialog] = useState(false)
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
    setProgress(0)
    completedCount = 0

    const updatePromises = bookmarksToUpdate.map(async (bk) => {
      return await Promise.allSettled(
        selectValue.map(async (tagId) => {
          const { error } = await supabase.from('tag_items').upsert(
            {
              bookmark_id: bk.id,
              tag_id: tagId,
            },
            { onConflict: 'bookmark_id, tag_id' },
          )

          if (isDelete) {
            const remainingTags = selectValue.join(',')
            await supabase.from('tag_items').delete().eq('bookmark_id', bk.id).not('tag_id', 'in', `(${remainingTags})`)
          }

          if (error) throw new Error(error.message)
          completedCount++
          bookmarksToUpdate.length > 1 && setProgress((completedCount / totalOperations) * 100)
        }),
      )
    })

    const totalOperations = bookmarksToUpdate.length
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
        TAGS_QUERY,
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
      setOpenDialog(false)
      return
    }

    setLoading(true)
    setProgress(0)
    await handleTagUpdate(bookmarksToUpdate, selectValue.length > 0)
    setOpenDialog(false)
    setLoading(false)
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (isLoading) return
        setOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-sm"
        onCloseAutoFocus={() => {
          setSelectValue(getInitialItems())
        }}
      >
        <DialogHeader>
          <DialogTitle>Update tags</DialogTitle>
          <DialogDescription className="break-words">{bookmarkName}</DialogDescription>
        </DialogHeader>

        <div>
          {tagsLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <>
              <div className="flex h-8 items-center gap-2">
                <Label htmlFor="select-tags">Folder</Label>
              </div>
              {tags && (
                <MultiSelect
                  id="select-tags"
                  value={selectValue}
                  emptyText="No tags yet"
                  placeholder="Select tags"
                  onChange={setSelectValue}
                  options={tags.map((tag) => ({ value: `${tag.id}`, label: tag.name }))}
                />
              )}
            </>
          )}

          {progress > 0 && <Progress value={progress} />}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          {modEnabled && (
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => handleUpdateTags(bookmarks ? bookmarks : [bookmark])}
            >
              <span className={cn(isLoading && 'invisible')}>Update</span>
              {isLoading && <Spinner className="absolute" />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
