import type { Metadata } from 'next'
import { ExportBookmarks } from '@/components/settings/export-bookmarks'
import { ProfileSettings } from '@/components/settings/profile/settings'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: {
    default: 'Settings',
    template: `%s · ${siteConfig.name}`,
  },
}

export default async function SettingsPage() {
  return (
    <>
      <ProfileSettings />
      <ExportBookmarks />
    </>
  )
}
