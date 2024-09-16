import { TypographyH4 } from '@/components/ui/typography'
import { Spinner } from '@/components/spinner'

export default function BookmarksLoading() {
  return (
    <div>
      <TypographyH4>Bookmarks</TypographyH4>
      <div className="mt-4 flex items-center">
        <Spinner className="mr-2" />
        Retrieving bookmarks...
      </div>
    </div>
  )
}
