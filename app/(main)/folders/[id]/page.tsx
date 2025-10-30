import { cache } from 'react'
import { getFolderDetails } from '@/lib/server-actions/folders'
import { FolderItemsClientPage } from './page.client'

interface FolderItemsProps {
  params: Promise<{ id: string }>
}

const getCachedFolderDetails = cache(getFolderDetails)

export async function generateMetadata(props: FolderItemsProps) {
  const params = await props.params

  const folderDetails = await getCachedFolderDetails(params.id)
  const title = folderDetails?.name || 'Folder items'

  return {
    title,
  }
}

export default async function FolderItemsPage(props: FolderItemsProps) {
  const params = await props.params
  const folderDetails = await getCachedFolderDetails(params.id)

  return <FolderItemsClientPage folderId={params.id} folderDetails={folderDetails} />
}
