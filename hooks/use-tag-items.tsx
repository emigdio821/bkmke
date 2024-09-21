import { useQuery } from '@tanstack/react-query'
import { TAG_ITEMS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useTagItems(bookmarkId?: number) {
  const supabase = createClient()

  async function getTagItems() {
    let data = null
    let error = null

    if (bookmarkId) {
      const { data: tagsWithIdData, error: tagsWithIdErr } = await supabase
        .from('tag_items')
        .select()
        .eq('bookmark_id', bookmarkId)
      data = tagsWithIdData
      error = tagsWithIdErr
    } else {
      const { data: rawItems, error: rawError } = await supabase.from('tag_items').select()
      data = rawItems
      error = rawError
    }

    if (error) {
      console.log('Unable to fetch tags', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: [TAG_ITEMS_QUERY, bookmarkId], queryFn: getTagItems })
}
