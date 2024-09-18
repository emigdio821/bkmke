import { useQuery } from '@tanstack/react-query'
import { FOLDERS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useFolders() {
  const supabase = createClient()

  async function getFolders() {
    const { data, error } = await supabase.from('folders').select().order('name')

    if (error) {
      console.log('Unable to fetch folders', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: [FOLDERS_QUERY], queryFn: getFolders })
}
