import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'

export const getTagDetails = createServerFn()
  .inputValidator((data: { tagId: string }) => data)
  .handler(async ({ data }) => {
    const { tagId } = data
    const supabase = await createClient()
    const tagDetails = await supabase.from('tags').select().eq('id', tagId).order('name')

    if (!tagDetails.data || tagDetails.error) {
      return null
    }

    return tagDetails.data
  })
