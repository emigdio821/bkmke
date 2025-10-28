import { createFileRoute } from '@tanstack/react-router'
import { BookmarksClientPage } from './(main)/bookmarks/page.client'

// export const metadata: Metadata = {
//   title: {
//     default: 'Bookmarks',
//     template: `%s · ${siteConfig.name}`,
//   },
// }

export const Route = createFileRoute('/page')({
  component: BookmarksPage,
})

function BookmarksPage() {
  return <BookmarksClientPage />
}
