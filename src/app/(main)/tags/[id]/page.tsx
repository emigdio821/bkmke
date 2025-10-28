import { createClient } from '@/lib/supabase/server'
import { TagitemsClientPage } from './page.client'

interface TagItemsProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: TagItemsProps) {
  const params = await props.params
  const supabase = await createClient()
  const { data } = await supabase.from('tags').select().eq('id', params.id).order('name')
  const title = data?.[0]?.name || 'Tag items'

  return {
    title,
  }
}

export default async function TagItemsPage(props: TagItemsProps) {
  const params = await props.params
  return <TagitemsClientPage id={params.id} />
}
