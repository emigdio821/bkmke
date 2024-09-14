import { TypographyH3 } from '@/components/ui/typography'
import { siteConfig } from '@/config/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'My bookmarks',
    template: `%s · ${siteConfig.name}`,
  },
}

export default async function DashboardPage() {
  return (
    <>
      <TypographyH3>My bookmarks</TypographyH3>
    </>
  )
}
