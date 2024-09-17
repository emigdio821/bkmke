import { useQuery } from '@tanstack/react-query'
import { TAGS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useTagItems() {
  const supabase = createClient()

  async function getTagItems() {
    const { data, error } = await supabase.schema('public').from('tag_items').select()

    if (error) {
      console.log('Unable to fetch tags', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: [TAGS_QUERY], queryFn: getTagItems })
}
