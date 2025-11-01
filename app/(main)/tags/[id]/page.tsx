import { cache } from 'react'
import { getTagDetails } from '@/lib/server-actions/tags'
import { TagitemsClientPage } from './page.client'

interface TagItemsProps {
  params: Promise<{ id: string }>
}

const getCachedTagDetails = cache(getTagDetails)

export async function generateMetadata(props: TagItemsProps) {
  const params = await props.params
  const tagDetails = await getCachedTagDetails(params.id)
  const title = tagDetails?.name || 'Tag items'

  return {
    title,
  }
}

export default async function TagItemsPage(props: TagItemsProps) {
  const params = await props.params
  const tagDetails = await getCachedTagDetails(params.id)

  return <TagitemsClientPage tagId={params.id} tagDetails={tagDetails} />
}
