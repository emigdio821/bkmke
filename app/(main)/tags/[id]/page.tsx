import { createClient } from '@/lib/supabase/server'
import { TagitemsClientPage } from './page.client'

interface TagItemsProps {
  params: { id: string }
}

export async function generateMetadata({ params }: TagItemsProps) {
  const supabase = createClient()
  const { data } = await supabase.from('tags').select().eq('id', params.id).order('name')
  const title = data?.[0]?.name || 'Tag items'

  return {
    title,
  }
}

export default function TagItemsPage({ params }: TagItemsProps) {
  return <TagitemsClientPage id={params.id} />
}
