import type { MutationOptionsWithoutKeyAndFn } from './types'
import { mutationOptions } from '@tanstack/react-query'
import { deleteBookmark } from '../server-actions/bookmarks'

export const BOOKMARK_DELETE_MUTATION_KEY = 'delete_bookmark'
export const BOOKMARKS_DELETE_MUTATION_KEY = 'delete_bookmarks'

export type BookmarkDeleteData = Awaited<ReturnType<typeof deleteBookmark>>

interface FailedBookmark {
  bookmarkId: string
  error: string
}

export interface BookmarksDeleteResult {
  successCount: number
  totalCount: number
  failedBookmarks: FailedBookmark[]
}

export const bookmarkDeleteMutation = (
  bookmarkId: string,
  options?: MutationOptionsWithoutKeyAndFn<BookmarkDeleteData>,
) =>
  mutationOptions({
    mutationKey: [BOOKMARK_DELETE_MUTATION_KEY, bookmarkId],
    mutationFn: () => deleteBookmark(bookmarkId),
    ...options,
  })

export const bookmarksDeleteMutation = (
  bookmarkIds: string[],
  options?: MutationOptionsWithoutKeyAndFn<BookmarksDeleteResult> & {
    onProgress?: (completed: number, total: number) => void
  },
) =>
  mutationOptions({
    mutationKey: [BOOKMARKS_DELETE_MUTATION_KEY],
    mutationFn: async () => {
      let successCount = 0
      const failedBookmarks: FailedBookmark[] = []

      for (let i = 0; i < bookmarkIds.length; i++) {
        try {
          const result = await deleteBookmark(bookmarkIds[i])
          if (result?.error) {
            failedBookmarks.push({
              bookmarkId: bookmarkIds[i],
              error: result.error.message || 'Unknown error',
            })
          } else {
            successCount++
          }
        } catch (error) {
          failedBookmarks.push({
            bookmarkId: bookmarkIds[i],
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }

        options?.onProgress?.(bookmarkIds.length > 1 ? i + 1 : 0, bookmarkIds.length)
      }

      return {
        successCount,
        totalCount: bookmarkIds.length,
        failedBookmarks,
      }
    },
    ...options,
  })
