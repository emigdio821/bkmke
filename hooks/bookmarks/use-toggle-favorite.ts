import type { Bookmark } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleFavoriteBookmark } from '@/lib/server-actions/bookmarks'
import { BOOKMARKS_QUERY_KEY } from '@/lib/ts-queries/bookmarks'
import { FOLDER_ITEMS_QUERY_KEY, FOLDERS_QUERY_KEY } from '@/lib/ts-queries/folders'
import { SIDEBAR_ITEM_COUNT_QUERY_KEY } from '@/lib/ts-queries/sidebar'
import { TAG_ITEMS_QUERY_KEY, TAGS_QUERY_KEY } from '@/lib/ts-queries/tags'

const QUERY_KEYS_TO_INVALIDATE = [
  [BOOKMARKS_QUERY_KEY],
  [SIDEBAR_ITEM_COUNT_QUERY_KEY],
  [FOLDERS_QUERY_KEY, FOLDER_ITEMS_QUERY_KEY],
  [TAGS_QUERY_KEY, TAG_ITEMS_QUERY_KEY],
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

      // Update bookmarks in all relevant queries (bookmarks, folder items, tag items)
      const bookmarkQueryKeys = [
        [BOOKMARKS_QUERY_KEY],
        [FOLDERS_QUERY_KEY, FOLDER_ITEMS_QUERY_KEY],
        [TAGS_QUERY_KEY, TAG_ITEMS_QUERY_KEY],
      ]

      bookmarkQueryKeys.forEach((queryKey) => {
        queryClient.setQueriesData({ queryKey }, (old: Bookmark[] | undefined) => {
          if (!old) return old
          return old.map((bk) => (bk.id === bookmark.id ? { ...bk, is_favorite: !bk.is_favorite } : bk))
        })
      })

      // Update sidebar item count
      queryClient.setQueryData(
        [SIDEBAR_ITEM_COUNT_QUERY_KEY],
        (old: { bookmarksCount: number; favoritesCount: number } | undefined) => {
          if (!old) return old
          const increment = bookmark.is_favorite ? -1 : 1
          return {
            ...old,
            favoritesCount: old.favoritesCount + increment,
          }
        },
      )

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

  return { toggleFavMutation: mutation }
}
