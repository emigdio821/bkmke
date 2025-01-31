import { Heading } from '@/components/ui/typography'
import { FavoritesClientPage } from './page.client'

export default function FavoritesPage() {
  return (
    <>
      <Heading>Favorites</Heading>
      <div className="mt-4">
        <FavoritesClientPage />
      </div>
    </>
  )
}
