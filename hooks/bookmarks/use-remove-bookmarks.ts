import type { Bookmark } from '@/types'
import { useState } from 'react'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { createClient } from '@/lib/supabase/client'
import { BOOKMARKS_QUERY_KEY, FAV_BOOKMARKS_QUERY_KEY } from '@/lib/ts-queries/bookmarks'
import { FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { SIDEBAR_ITEM_COUNT_QUERY_KEY } from '@/lib/ts-queries/sidebar'
import { TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'

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

    const queryKeysToInvalidate = [
      [BOOKMARKS_QUERY_KEY],
      [BOOKMARKS_QUERY_KEY, FAV_BOOKMARKS_QUERY_KEY],
      [SIDEBAR_ITEM_COUNT_QUERY_KEY],
    ]

    await invalidateQueries([[FOLDERS_QUERY_KEY], [TAGS_QUERY_KEY]], { exact: false })
    await invalidateQueries(queryKeysToInvalidate)
    setProgress(0)
  }

  return { handleRemoveBookmarks, progress, completedCount, errors }
}
