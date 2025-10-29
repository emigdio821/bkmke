import { useOptimistic } from 'react'
import type { Bookmark } from '@/types'
import { toast } from 'sonner'
import { toggleFavorite } from '@/lib/api'
import {
  BOOKMARKS_QUERY,
  FAV_BOOKMARKS_QUERY,
  FOLDER_ITEMS_QUERY,
  FOLDERS_QUERY,
  NAV_ITEMS_COUNT_QUERY,
  TAG_ITEMS_QUERY,
} from '@/lib/constants'
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

    await invalidateQueries([
      FOLDERS_QUERY,
      BOOKMARKS_QUERY,
      FOLDER_ITEMS_QUERY,
      TAG_ITEMS_QUERY,
      NAV_ITEMS_COUNT_QUERY,
      FAV_BOOKMARKS_QUERY,
    ])
  }

  return { optimisticBk, handleToggleFavorite }
}
