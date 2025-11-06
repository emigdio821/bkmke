'use server'

import type { Folder } from '@/types'
import type { z } from 'zod'
import type { createFolderSchema } from '../schemas/form'
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

export async function listFolders() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('folders').select('*, items:bookmarks!inner(count)').order('name')

  if (error) {
    console.error('Unable to fetch folders:', error.message)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  return buildFolderTree(data)
}

export async function getFolderDetails(folderId: string) {
  if (!folderId) {
    console.error('getFolderDetails: folderId is required')
    return null
  }

  const supabase = await createClient()
  const { data, error } = await supabase.from('folders').select().eq('id', folderId).order('name').single()

  if (error) {
    console.error('Unable to fetch folder details:', error.message)
    return null
  }

  return data || null
}

export async function getFolderItems(folderId: string) {
  if (!folderId) {
    console.error('getFolderItems: folderId is required')
    return []
  }

  const supabase = await createClient()

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
    console.error('Unable to fetch folder items:', error.message)
    return []
  }

  return data || []
}

export async function moveToFolder(folderId: string, bookmarkId: string) {
  const supabase = await createClient()

  return supabase
    .from('bookmarks')
    .update({ folder_id: folderId || null })
    .eq('id', bookmarkId)
}

type CreateFolderValues = z.infer<typeof createFolderSchema>

export async function createFolder(values: CreateFolderValues, parentId?: string) {
  const supabase = await createClient()

  return supabase.from('folders').insert({
    ...values,
    parent_id: parentId || null,
  })
}

export async function editFolder(values: CreateFolderValues, folderId: string) {
  const supabase = await createClient()

  return supabase.from('folders').update(values).eq('id', folderId)
}

export async function deleteFolder(folderId: string) {
  const supabase = await createClient()

  return supabase.from('folders').delete().eq('id', folderId)
}
