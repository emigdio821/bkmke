import { useQuery } from '@tanstack/react-query'
import { TAGS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useTags() {
  const supabase = createClient()

  async function getTags() {
    const { data, error } = await supabase.from('tags').select().order('name')

    if (error) {
      console.log('Unable to fetch tags', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: [TAGS_QUERY], queryFn: getTags })
}
