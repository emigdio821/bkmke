import type { Bookmark } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await toggleFavoriteBookmark(bookmark)
      if (error) throw error
    },
    onMutate: async () => {
      await Promise.all(QUERY_KEYS_TO_INVALIDATE.map((queryKey) => queryClient.cancelQueries({ queryKey })))

      const previousData = QUERY_KEYS_TO_INVALIDATE.map((queryKey) => ({
        queryKey,
        data: queryClient.getQueryData(queryKey),
      }))

      queryClient.setQueriesData({ queryKey: [BOOKMARKS_QUERY_KEY] }, (old: Bookmark[] | undefined) => {
        if (!old) return old
        return old.map((bk) => (bk.id === bookmark.id ? { ...bk, is_favorite: !bk.is_favorite } : bk))
      })

      return { previousData }
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data)
        })
      }

      toast.error('Error', { description: 'Unable to toggle favorite at this time, try again.' })
      console.error('Toggle favorite error:', error)
    },
    onSettled: () => {
      QUERY_KEYS_TO_INVALIDATE.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey })
      })
    },
  })

  const optimisticBk: Bookmark = mutation.isPending ? { ...bookmark, is_favorite: !bookmark.is_favorite } : bookmark

  return { optimisticBk, handleToggleFavorite: mutation.mutate }
}
