import type { Bookmark } from '@/types'
import { queryOptions } from '@tanstack/react-query'

export const BOOKMARKS_QUERY_KEY = 'bookmarks'
export const FAV_BOOKMARKS_QUERY_KEY = 'favorite_bookmarks'

export const bookmarkListQuery = () =>
  queryOptions({
    queryKey: [BOOKMARKS_QUERY_KEY],
    queryFn: async (): Promise<Bookmark[]> => {
      const response = await fetch('/api/bookmarks')
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks')
      }
      return response.json()
    },
  })

export const favoriteBookmarkListQuery = () =>
  queryOptions({
    queryKey: [BOOKMARKS_QUERY_KEY, FAV_BOOKMARKS_QUERY_KEY],
    queryFn: async (): Promise<Bookmark[]> => {
      const response = await fetch('/api/bookmarks/favorite')
      if (!response.ok) {
        throw new Error('Failed to fetch favorite bookmarks')
      }
      return response.json()
    },
  })
