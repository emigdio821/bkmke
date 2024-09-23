import { useQuery } from '@tanstack/react-query'
import { FOLDERS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useFolders(folderId?: number) {
  const supabase = createClient()

  async function getFolders() {
    let data = null
    let error = null

    if (folderId) {
      const { data: filteredFolder, error: filteredFolderErr } = await supabase
        .from('folders')
        .select()
        .eq('id', folderId)
        .order('name')

      data = filteredFolder
      error = filteredFolderErr
    } else {
      const { data: rawData, error: rawError } = await supabase.from('folders').select().order('name')

      data = rawData
      error = rawError
    }

    if (error) {
      console.log('Unable to fetch bookmarks', error.message)
    }

    return data || []
  }

  return useQuery({ queryKey: folderId ? [FOLDERS_QUERY, folderId] : [FOLDERS_QUERY], queryFn: getFolders })
}
