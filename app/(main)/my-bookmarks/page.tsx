import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/server'
import { TypographyH3 } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'

export const metadata: Metadata = {
  title: {
    default: 'My bookmarks',
    template: `%s · ${siteConfig.name}`,
  },
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: bookmarks, error } = await supabase.schema('public').from('bookmarks').select()

  if (error) {
    console.log('Error while getting bookmarks initial data', error.message)
  }

  return (
    <>
      <TypographyH3>My bookmarks</TypographyH3>
      <div className="mt-6">{bookmarks && <DataTable columns={columns} data={bookmarks} />}</div>
    </>
  )
}
