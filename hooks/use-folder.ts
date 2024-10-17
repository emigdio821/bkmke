import { useQuery } from '@tanstack/react-query'
import { FOLDERS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useFolder(folderId: string) {
  const supabase = createClient()

  async function getFolder() {
    const { data, error } = await supabase.from('folders').select().eq('id', folderId).order('name')

    if (error) {
      console.log('Unable to fetch bookmarks', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: [FOLDERS_QUERY, folderId], queryFn: getFolder })
}
