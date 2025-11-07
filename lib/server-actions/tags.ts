'use server'

import { createClient } from '../supabase/server'

export async function deleteTag(tagId: string) {
  const supabase = await createClient()
  return supabase.from('tags').delete().eq('id', tagId)
}

export async function createTag(name: string) {
  const supabase = await createClient()
  return supabase.from('tags').insert({ name })
}

export async function updateTag(tagId: string, values: { name: string }) {
  const supabase = await createClient()
  return supabase.from('tags').update(values).eq('id', tagId)
}
