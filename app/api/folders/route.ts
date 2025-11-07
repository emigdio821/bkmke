import type { Folder } from '@/types'
import { createClient } from '@/lib/supabase/server'

function buildFolderTree(folders: Array<Omit<Folder, 'children'>>): Folder[] {
  const folderMap: Record<string, Folder> = {}
  const tree: Folder[] = []

  for (const folder of folders) {
    folderMap[folder.id] = { ...folder, children: [] }
  }

  for (const folder of folders) {
    if (folder.parent_id && folderMap[folder.parent_id]) {
      folderMap[folder.parent_id].children.push(folderMap[folder.id])
    } else {
      tree.push(folderMap[folder.id])
    }
  }

  return tree
}

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('folders').select('*, items:bookmarks!inner(count)').order('name')

  if (error) {
    throw new Error('Unable to fetch folders:', { cause: error.message })
  }

  const folders = data ? buildFolderTree(data) : []

  return Response.json(folders)
}
