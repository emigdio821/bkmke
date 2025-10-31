import { queryOptions } from '@tanstack/react-query'
import { listBookmarks, listFavoriteBookmarks } from '@/lib/server-actions/bookmarks'

export const BOOKMARKS_QUERY_KEY = 'bookmarks'
export const FAV_BOOKMARKS_QUERY_KEY = 'favorite_bookmarks'

export type BookmarkListData = Awaited<ReturnType<typeof listBookmarks>>
export type FavoriteBookmarkListData = Awaited<ReturnType<typeof listFavoriteBookmarks>>

export const bookmarkListQuery = () =>
  queryOptions({
    queryKey: [BOOKMARKS_QUERY_KEY],
    queryFn: listBookmarks,
  })

export const favoriteBookmarkListQuery = () =>
  queryOptions({
    queryKey: [BOOKMARKS_QUERY_KEY, FAV_BOOKMARKS_QUERY_KEY],
    queryFn: listFavoriteBookmarks,
  })
