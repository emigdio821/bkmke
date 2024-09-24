'use client'

import NiceModal from '@ebay/nice-modal-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertActionDialog } from '@/components/dialogs/alert-action'

export function ExportBookmarks() {
  const supabase = createClient()

  async function handleExportBookmarks() {
    const { data, error } = await supabase.from('bookmarks').select('url')

    if (error) {
      console.error(error.message)
      toast.error('Error', { description: 'Unable to export bookmarks at this time, try again.' })
      return
    }

    const fileData = data.map((bk) => bk.url).join('\n')
    const blob = new Blob([fileData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'bkmk-bookmarks.txt'
    link.href = url
    link.click()
  }

  return (
    <Card>
      <CardHeader className="justify-between gap-2 sm:flex-row">
        <div className="space-y-1.5">
          <CardTitle>Export bookmarks</CardTitle>
          <CardDescription>Export your bookmarks as a plain text file.</CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void NiceModal.show(AlertActionDialog, {
              action: async () => {
                await handleExportBookmarks()
              },
              message: 'This action will export all your bookmarks.',
            })
          }}
        >
          Export
        </Button>
      </CardHeader>
    </Card>
  )
}
