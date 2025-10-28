import { createFileRoute } from '@tanstack/react-router'
import { BookmarksClientPage } from '@/app/(main)/bookmarks/page.client'

export const Route = createFileRoute('/')({
  component: () => <BookmarksClientPage />,
})
