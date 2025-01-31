import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { Heading } from '@/components/ui/typography'
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
      <Heading>Settings</Heading>
      <div className="mt-4 space-y-4">
        <ProfileSettings />
        <ExportBookmarks />
      </div>
    </>
  )
}
