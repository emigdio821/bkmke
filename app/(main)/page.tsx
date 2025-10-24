import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { BookmarksClientPage } from './bookmarks/page.client'

export const metadata: Metadata = {
  title: {
    default: 'Bookmarks',
    template: `%s · ${siteConfig.name}`,
  },
}

export default function BookmarksPage() {
  return <BookmarksClientPage />
}
