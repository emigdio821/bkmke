import { TypographyH4 } from '@/components/ui/typography'
import { FavoritesClientPage } from './page.client'

export default function FavoritesPage() {
  return (
    <>
      <TypographyH4>Favorites</TypographyH4>
      <div className="mt-4">
        <FavoritesClientPage />
      </div>
    </>
  )
}
