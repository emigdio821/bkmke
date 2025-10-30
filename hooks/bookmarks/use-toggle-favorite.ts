import type { Bookmark } from '@/types'
import { useOptimistic } from 'react'
import { toast } from 'sonner'
import { toggleFavorite } from '@/lib/api'
import { BOOKMARKS_QUERY, FAV_BOOKMARKS_QUERY } from '@/lib/constants'
import { FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { SIDEBAR_ITEM_COUNT_QUERY_KEY } from '@/lib/ts-queries/sidebar'
import { TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'
import { useInvalidateQueries } from '../use-invalidate-queries'

export function useToggleFavorite(bookmark: Bookmark) {
  const { invalidateQueries } = useInvalidateQueries()
  const [optimisticBk, addOptimisticBk] = useOptimistic(bookmark, (state, favStatus: boolean) => ({
    ...state,
    is_favorite: favStatus,
  }))

  async function handleToggleFavorite() {
    addOptimisticBk(!bookmark.is_favorite)
    const response = await toggleFavorite(bookmark)

    if (response?.error) {
      addOptimisticBk(bookmark.is_favorite)
      toast.error('Unable to toggle favorite at this time, try again.')
      return
    }

    const queryKeysToInvalidate = [[BOOKMARKS_QUERY], [FAV_BOOKMARKS_QUERY], [SIDEBAR_ITEM_COUNT_QUERY_KEY]]

    await invalidateQueries([[FOLDERS_QUERY_KEY], [TAGS_QUERY_KEY]], { exact: false })
    await invalidateQueries(queryKeysToInvalidate)
  }

  return { optimisticBk, handleToggleFavorite }
}
