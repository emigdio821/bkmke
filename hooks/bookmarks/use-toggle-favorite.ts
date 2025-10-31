import type { Bookmark } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useOptimistic } from 'react'
import { toast } from 'sonner'
import { toggleFavorite } from '@/lib/api'
import { BOOKMARKS_QUERY_KEY } from '@/lib/ts-queries/bookmarks'
import { FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { SIDEBAR_ITEM_COUNT_QUERY_KEY } from '@/lib/ts-queries/sidebar'
import { TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'

const QUERY_KEYS_TO_INVALIDATE = [
  [BOOKMARKS_QUERY_KEY],
  [SIDEBAR_ITEM_COUNT_QUERY_KEY],
  [FOLDERS_QUERY_KEY],
  [TAGS_QUERY_KEY],
]

export function useToggleFavorite(bookmark: Bookmark) {
  const queryClient = useQueryClient()
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

    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS_TO_INVALIDATE })
  }

  return { optimisticBk, handleToggleFavorite }
}
