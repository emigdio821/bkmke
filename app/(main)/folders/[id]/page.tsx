import { createClient } from '@/lib/supabase/server'
import { FolderItemsClientPage } from './page.client'

interface FolderItemsProps {
  params: { id: string }
}

export async function generateMetadata({ params }: FolderItemsProps) {
  const supabase = createClient()
  const { data } = await supabase.from('folders').select().eq('id', params.id).order('name')
  const title = data?.[0]?.name || 'Folder items'

  return {
    title,
  }
}

export default function FolderItemsPage({ params }: FolderItemsProps) {
  return (
    <>
      <FolderItemsClientPage id={params.id} />
    </>
  )
}
