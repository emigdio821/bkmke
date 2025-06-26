import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { TypographyH4 } from '@/components/ui/typography'
import { ExportBookmarks } from '@/components/settings/export-bookmarks'
import { ProfileSettings } from '@/components/settings/profile/settings'

export const metadata: Metadata = {
  title: {
    default: 'Settings',
    template: `%s · ${siteConfig.name}`,
  },
}

export default async function SettingsPage() {
  return (
    <>
      <TypographyH4>Settings</TypographyH4>
      <ProfileSettings />
      <ExportBookmarks />
    </>
  )
}
