'use client'

import { toast } from 'sonner'
import { AlertActionDialog } from '@/components/dialogs/alert-action'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { InlineCode } from '@/components/ui/typography'
import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/client'

export function ExportBookmarks() {
  const supabase = createClient()

  async function handleExportBookmarks() {
    const { data, error } = await supabase.from('bookmarks').select('url')

    if (error) {
      console.error(error.message)
      toast.error('Error', { description: 'Unable to export bookmarks at this time, try again.' })
      return
    }

    if (!data || data.length === 0) {
      toast.warning('There are no bookmarks to export.')
      return
    }

    const fileData = data.map((bk) => bk.url).join('\n')
    const blob = new Blob([fileData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `${siteConfig.name}-bookmarks.txt`
    link.href = url
    link.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export bookmarks</CardTitle>
        <CardDescription>Export your bookmarks as a plain text file.</CardDescription>
      </CardHeader>
      <CardFooter>
        <AlertActionDialog
          title="Export bookmarks?"
          message={
            <>
              This action will export all your bookmarks in a <InlineCode>.txt</InlineCode> file.
            </>
          }
          action={async () => await handleExportBookmarks()}
          trigger={
            <Button type="button" variant="outline">
              Export
            </Button>
          }
        />
      </CardFooter>
    </Card>
  )
}
