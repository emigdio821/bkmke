import type { Bookmark } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { MultiSelect } from '@/components/multi-select'
import { Spinner } from '@/components/spinner'
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
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { createClient } from '@/lib/supabase/client'
import { BOOKMARKS_QUERY_KEY, FAV_BOOKMARKS_QUERY_KEY } from '@/lib/ts-queries/bookmarks'
import { tagListQuery, TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'
import { cn } from '@/lib/utils'

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
  const supabase = createClient()
  const modEnabled = useModEnabled()
  const { invalidateQueries } = useInvalidateQueries()
  const { data: tags, isLoading: tagsLoading } = useQuery(tagListQuery())
  const [progress, setProgress] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectValue, setSelectValue] = useState<string[]>(getInitialItems())

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
      const queryKeysToInvalidate = [[BOOKMARKS_QUERY_KEY], [BOOKMARKS_QUERY_KEY, FAV_BOOKMARKS_QUERY_KEY]]

      await invalidateQueries([TAGS_QUERY_KEY], { exact: false })
      await invalidateQueries(queryKeysToInvalidate)
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
          <DialogDescription className="wrap-break-word">{bookmarkName}</DialogDescription>
        </DialogHeader>

        <div>
          {tagsLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <>
              <div className="flex h-8 items-center gap-2">
                <Label htmlFor="select-tags">Tags</Label>
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
