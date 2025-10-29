import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { FavoritesClientPage } from './page.client'

export const metadata: Metadata = {
  title: {
    default: 'Favorites',
    template: `%s · ${siteConfig.name}`,
  },
}

export default function FavoritesPage() {
  return <FavoritesClientPage />
}
