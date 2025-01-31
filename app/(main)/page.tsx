import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { Heading } from '@/components/ui/typography'
import { BookmarksClientPage } from './bookmarks/page.client'

export const metadata: Metadata = {
  title: {
    default: 'Bookmarks',
    template: `%s · ${siteConfig.name}`,
  },
}

export default async function BookmarksPage() {
  return (
    <>
      <Heading>Bookmarks</Heading>
      <div className="mt-4">
        <BookmarksClientPage />
      </div>
    </>
  )
}
