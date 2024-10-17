import { useQuery } from '@tanstack/react-query'
import { BOOKMARKS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useBookmarks(bookmarkId?: string) {
  const supabase = createClient()

  async function getBookmarks() {
    let data = null
    let error = null

    if (bookmarkId) {
      const { data: filteredBookmarks, error: filteredBookmarksErr } = await supabase
        .from('bookmarks')
        .select(
          `
            *,
            tag_items!bookmark_id(id, tag:tags(id,name)),
            folder:folders(name)
          `,
        )
        .eq('id', bookmarkId)
        .order('name')

      data = filteredBookmarks
      error = filteredBookmarksErr
    } else {
      const { data: rawData, error: rawError } = await supabase
        .from('bookmarks')
        .select(
          `
            *,
            tag_items!bookmark_id(id, tag:tags(id,name)),
            folder:folders(name)
          `,
        )
        .order('name')

      data = rawData
      error = rawError
    }

    if (error) {
      console.log('Unable to fetch bookmarks', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: bookmarkId ? [BOOKMARKS_QUERY, bookmarkId] : [BOOKMARKS_QUERY], queryFn: getBookmarks })
}
