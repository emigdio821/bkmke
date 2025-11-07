'use server'

import type { z } from 'zod'
import type { createFolderSchema } from '../schemas/form'
import { createClient } from '@/lib/supabase/server'

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

export async function updateFolder(values: CreateFolderValues, folderId: string) {
  const supabase = await createClient()

  return supabase.from('folders').update(values).eq('id', folderId)
}

export async function deleteFolder(folderId: string) {
  const supabase = await createClient()

  return supabase.from('folders').delete().eq('id', folderId)
}
