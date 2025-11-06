'use server'

import { createClient } from '../supabase/server'

export async function listTags() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tags').select('*, items:tag_items!inner(count)').order('name')

  if (error) {
    console.error('Unable to fetch tags:', error.message)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  return data || []
}

export async function getTagDetails(tagId: string) {
  if (!tagId) {
    console.error('getTagDetails: tagId is required')
    return null
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tags')
    .select('*, items:tag_items!inner(count)')
    .eq('id', tagId)
    .order('name')
    .single()

  if (error) {
    console.error('Unable to fetch tag details:', error.message)
    return null
  }

  return data || null
}

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
