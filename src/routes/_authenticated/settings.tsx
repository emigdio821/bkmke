import { createFileRoute } from '@tanstack/react-router'
import { createTitle } from '@/lib/seo'
import { ExportBookmarks } from '@/components/settings/export-bookmarks'
import { ProfileSettings } from '@/components/settings/profile/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  head: () => ({
    meta: [{ title: createTitle('Settings') }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <ProfileSettings />
      <ExportBookmarks />
    </>
  )
}
