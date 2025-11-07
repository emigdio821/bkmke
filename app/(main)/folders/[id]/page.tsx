import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { FolderItemsClientPage } from './page.client'

interface FolderItemsProps {
  params: Promise<{ id: string }>
}

const getFolderDetails = cache(async (id: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('folders').select().eq('id', id).order('name').single()

  if (error) {
    return undefined
  }

  return data || undefined
})

export async function generateMetadata(props: FolderItemsProps) {
  const params = await props.params
  const folderDetails = await getFolderDetails(params.id)
  const title = folderDetails?.name || 'Folder items'

  return {
    title,
  }
}

export default async function FolderItemsPage(props: FolderItemsProps) {
  const params = await props.params
  const folderDetails = await getFolderDetails(params.id)

  return <FolderItemsClientPage folderId={params.id} folderDetails={folderDetails} />
}
