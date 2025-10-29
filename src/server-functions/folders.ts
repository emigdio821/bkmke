import type { Folder } from '@/types'
import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'

export const listFolders = createServerFn().handler(async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('folders').select('*, items:bookmarks!inner(count)').order('name')

  if (error) {
    console.log('Unable to fetch folders', error.message)
    return []
  }

  const folderMap: Record<string, Folder> = {}
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
})

export const getFolderDetails = createServerFn()
  .inputValidator((data: { folderId: string }) => data)
  .handler(async ({ data }) => {
    const { folderId } = data
    const supabase = await createClient()
    const folderDetails = await supabase.from('folders').select().eq('id', folderId).order('name')

    if (!folderDetails.data || folderDetails.error) {
      if (folderDetails.error) {
        console.error('Unable to fetch folder items', folderDetails.error.message)
      }
      return null
    }

    return folderDetails.data
  })

export const getFolderItems = createServerFn()
  .inputValidator((data: { folderId: string }) => data)
  .handler(async ({ data }) => {
    const { folderId } = data
    const supabase = await createClient()

    const folderItems = await supabase
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

    if (!folderItems.data || folderItems.error) {
      if (folderItems.error) {
        console.error('Unable to fetch folder items', folderItems.error.message)
      }

      return []
    }

    return folderItems.data
  })
