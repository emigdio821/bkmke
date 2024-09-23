import { useQuery } from '@tanstack/react-query'
import { FOLDER_ITEMS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useFolderItems(folderId: number) {
  const supabase = createClient()

  async function getFolderItems() {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*, tag_items(id, tags(id,name)), folders(name)')
      .eq('folder_id', folderId)
      .order('name')

    if (error) {
      console.log('Unable to fetch folder items', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: [FOLDER_ITEMS_QUERY, folderId], queryFn: getFolderItems })
}
