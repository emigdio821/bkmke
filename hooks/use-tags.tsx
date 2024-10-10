import { useQuery } from '@tanstack/react-query'
import { TAGS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useTags(tagId?: number) {
  const supabase = createClient()

  async function getTags() {
    let data = null
    let error = null

    if (tagId) {
      const { data: filteredFolder, error: filteredFolderErr } = await supabase
        .from('tags')
        .select('*, items:tag_items!inner(count)')
        .eq('id', tagId)
        .order('name')

      data = filteredFolder
      error = filteredFolderErr
    } else {
      const { data: rawData, error: rawError } = await supabase
        .from('tags')
        .select('*, items:tag_items!inner(count)')
        .order('name')

      data = rawData
      error = rawError
    }

    if (error) {
      console.log('Unable to fetch bookmarks', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: tagId ? [TAGS_QUERY, tagId] : [TAGS_QUERY], queryFn: getTags })
}
