import type { Bookmark } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleFavoriteBookmark } from '@/lib/server-actions/bookmarks'
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

  async function handleToggleFavorite() {
    const { error } = await toggleFavoriteBookmark(bookmark)

    if (error) {
      toast.error('Unable to toggle favorite at this time, try again.')
      return
    }

    await Promise.all(QUERY_KEYS_TO_INVALIDATE.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
  }

  return { optimisticBk: bookmark, handleToggleFavorite }
}
