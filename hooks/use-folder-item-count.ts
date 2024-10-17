import { useQuery } from '@tanstack/react-query'
import { FOLDER_ITEM_COUNT_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useFolderItemCount(folderId: string) {
  const supabase = createClient()

  async function getFolderItemCount() {
    const { data, error } = await supabase.from('bookmarks').select('id').eq('folder_id', folderId).order('name')

    if (error) {
      console.log('Unable to fetch folder item count', error.message)
    }

    console.log('item count', data)

    return data?.length || 0
  }

  return useQuery({ queryKey: [FOLDER_ITEM_COUNT_QUERY, folderId], queryFn: getFolderItemCount })
}
