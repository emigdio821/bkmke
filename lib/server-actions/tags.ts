'use server'

import type { Bookmark } from '@/types'
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

export async function getTagItems(tagId: string) {
  if (!tagId) {
    console.error('getTagItems: tagId is required')
    return []
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tag_items')
    .select(
      `
          bookmark:bookmarks!bookmark_id (
            *,
            tag_items!bookmark_id(id, tag:tags(id,name)),
            folder:folders(name)
          )
        `,
    )
    .eq('tag_id', tagId)

  if (error) {
    console.error('Unable to fetch tag items:', error.message)
    return []
  }

  const formattedData: Bookmark[] =
    data?.map((item) => (Array.isArray(item.bookmark) ? item.bookmark[0] : item.bookmark)) || null

  if (formattedData) {
    formattedData.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
  }

  return formattedData || []
}
