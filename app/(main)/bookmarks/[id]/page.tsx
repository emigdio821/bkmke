import { TypographyH4 } from '@/components/ui/typography'
import { BookmarkDetailsClientPage } from './page.client'

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
