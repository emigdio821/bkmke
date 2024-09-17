import { useQuery } from '@tanstack/react-query'
import { BOOKMARKS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useBookmarks() {
  const supabase = createClient()

  async function getBookmarks() {
    const { data, error } = await supabase
      .schema('public')
      .from('bookmarks')
      .select('*, tag_items(tag_id, tags(name))')
      .order('name')

    if (error) {
      console.log('Unable to fetch bookmarks', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: [BOOKMARKS_QUERY], queryFn: getBookmarks })
}
