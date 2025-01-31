import { createClient } from '@/lib/supabase/server'
import { FolderItemsClientPage } from './page.client'

interface FolderItemsProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: FolderItemsProps) {
  const params = await props.params
  const supabase = await createClient()
  const { data } = await supabase.from('folders').select().eq('id', params.id).order('name')
  const title = data?.[0]?.name || 'Folder items'

  return {
    title,
  }
}

export default async function FolderItemsPage(props: FolderItemsProps) {
  const params = await props.params

  return (
    <>
      <FolderItemsClientPage id={params.id} />
    </>
  )
}
