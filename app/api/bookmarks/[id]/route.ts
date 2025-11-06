import type { NextRequest } from 'next/server'
import { ALL_BOOKMARKS_SELECT } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params
  const supabase = await createClient()
  const { data, error } = await supabase.from('bookmarks').select(ALL_BOOKMARKS_SELECT).eq('id', id).single()

  if (error) {
    throw new Error('Unable to fetch bookmark:', { cause: error.message })
  }

  return Response.json(data || [])
}
