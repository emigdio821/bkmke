import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'

export const getFolderDetails = createServerFn()
  .inputValidator((data: { folderId: string }) => data)
  .handler(async ({ data }) => {
    const { folderId } = data
    const supabase = await createClient()
    const folderDetails = await supabase.from('folders').select().eq('id', folderId).order('name')

    if (!folderDetails.data || folderDetails.error) {
      return null
    }

    return folderDetails.data
  })
