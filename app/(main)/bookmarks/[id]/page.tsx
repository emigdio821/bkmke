import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { TypographyH4 } from '@/components/ui/typography'
import { BookmarkDetailsClientPage } from './page.client'

export const metadata: Metadata = {
  title: {
    default: 'Bookmark details',
    template: `%s · ${siteConfig.name}`,
  },
}

export default function BookmarkDetailsPage({ params }: { params: { id: string } }) {
  return (
    <>
      <TypographyH4>Bookmark details</TypographyH4>
      <div className="mt-4 space-y-4">
        <BookmarkDetailsClientPage id={Number(params.id)} />
      </div>
    </>
  )
}
