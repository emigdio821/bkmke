import { createFileRoute } from '@tanstack/react-router'
import { ExportBookmarks } from '@/components/settings/export-bookmarks'
import { ProfileSettings } from '@/components/settings/profile/settings'

export const Route = createFileRoute('/_authenticated/settings')({
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
