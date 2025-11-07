import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tags').select('*, items:tag_items!inner(count)').order('name')

  if (error) {
    throw new Error('Unable to fetch bookmarks:', { cause: error.message })
  }

  return Response.json(data || [])
}
