import { useQuery } from '@tanstack/react-query'
import { FAV_BOOKMARKS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useFavoriteBookmarks() {
  const supabase = createClient()

  async function getFavoriteBookmarks() {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(
        `
            *,
            tag_items!bookmark_id(id, tag:tags(id,name)),
            folder:folders(name)
          `,
      )
      .eq('is_favorite', true)
      .order('name')

    if (error) {
      console.log('Unable to fetch favorite bookmarks', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: [FAV_BOOKMARKS_QUERY], queryFn: getFavoriteBookmarks })
}
