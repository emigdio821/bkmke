import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { TypographyH4 } from '@/components/ui/typography'
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
      <TypographyH4>Bookmarks</TypographyH4>
      <div>
        <BookmarksClientPage />
      </div>
    </>
  )
}
