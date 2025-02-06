import { useState } from 'react'
import type { Bookmark } from '@/types'
import {
  BOOKMARKS_QUERY,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  NAV_ITEMS_COUNT_QUERY,
  TAG_ITEMS_QUERY,
  TAGS_QUERY,
} from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'

let completedCount = 0

export function useRemoveBookmarks() {
  const supabase = createClient()
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState<PromiseRejectedResult[]>()
  const { invalidateQueries } = useInvalidateQueries()

  async function handleRemoveBookmarks(bksToRemove: Bookmark[]) {
    completedCount = 0

    const removePromises = bksToRemove.map((bk) =>
      supabase
        .from('bookmarks')
        .delete()
        .eq('id', bk.id)
        .then((result) => {
          if (result.error) throw new Error(result.error.message)
          completedCount++
          bksToRemove.length > 1 && setProgress((completedCount / bksToRemove.length) * 100)
        }),
    )

    const settledPromises = await Promise.allSettled(removePromises)
    const settledErrors = settledPromises.filter((p) => p.status === 'rejected')
    setErrors(settledErrors)

    await invalidateQueries([
      FOLDERS_QUERY,
      BOOKMARKS_QUERY,
      FOLDER_ITEMS_QUERY,
      TAG_ITEMS_QUERY,
      TAGS_QUERY,
      FAV_BOOKMARKS_QUERY,
      NAV_ITEMS_COUNT_QUERY,
    ])
    setProgress(0)
  }

  return { handleRemoveBookmarks, progress, completedCount, errors }
}
