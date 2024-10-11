import type { Folder } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { FOLDERS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useFolders() {
  const supabase = createClient()

  async function getFolders() {
    const { data, error } = await supabase.from('folders').select('*, items:bookmarks!inner(count)').order('name')

    if (error) {
      console.log('Unable to fetch folders', error.message)
      return []
    }

    const folderMap: Record<number, Folder> = {}
    const tree: Folder[] = []

    for (const folder of data) {
      folderMap[folder.id] = { ...folder, children: [] }
    }

    for (const folder of data) {
      if (folder.parent_id) {
        folderMap[folder.parent_id].children.push(folderMap[folder.id])
      } else {
        tree.push(folderMap[folder.id])
      }
    }

    return tree
  }

  return useQuery({ queryKey: [FOLDERS_QUERY], queryFn: getFolders })
}
