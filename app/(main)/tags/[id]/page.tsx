import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { TagitemsClientPage } from './page.client'

interface TagItemsProps {
  params: Promise<{ id: string }>
}

const getTagDetails = cache(async (id: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tags').select().eq('id', id).order('name').single()

  if (error) {
    return undefined
  }

  return data || undefined
})

export async function generateMetadata(props: TagItemsProps) {
  const params = await props.params
  const tagDetails = await getTagDetails(params.id)
  const title = tagDetails?.name || 'Tag items'

  return {
    title,
  }
}

export default async function TagItemsPage(props: TagItemsProps) {
  const params = await props.params
  const tagDetails = await getTagDetails(params.id)

  return <TagitemsClientPage tagId={params.id} tagDetails={tagDetails} />
}
