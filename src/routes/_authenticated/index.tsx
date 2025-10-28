import { createFileRoute } from '@tanstack/react-router'
import { BookmarksClientPage } from '@/app/(main)/bookmarks/page.client'

export const Route = createFileRoute('/_authenticated/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BookmarksClientPage />
}
