import { TypographyH3 } from '@/components/ui/typography'
import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'My bookmarks',
    template: `%s · ${siteConfig.name}`,
  },
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <>
      <TypographyH3>My bookmarks</TypographyH3>
      <p>User metadata: {JSON.stringify(data.user?.user_metadata, null, 2)}</p>
    </>
  )
}
