import { useQuery } from '@tanstack/react-query'
import { FOLDER_ITEMS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useFolderItems(folderId: string) {
  const supabase = createClient()

  async function getFolderItems() {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(
        `
          *,
          tag_items!bookmark_id(id, tag:tags(id,name)),
          folder:folders(name)
        `,
      )
      .eq('folder_id', folderId)
      .order('name')

    if (error) {
      console.log('Unable to fetch folder items', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: [FOLDER_ITEMS_QUERY, folderId], queryFn: getFolderItems })
}
