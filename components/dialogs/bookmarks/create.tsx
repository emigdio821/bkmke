'use client'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateAutomaticForm } from '@/components/bookmarks/create-automatic-form'
import { CreateManualForm } from '@/components/bookmarks/create-manual-form'

export const CreateBookmarkDialog = NiceModal.create(() => {
  const modal = useModal()

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          void modal.show()
        } else {
          void modal.hide()
        }
      }}
    >
      <DialogContent
        className="max-w-sm"
        aria-describedby={undefined}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        onCloseAutoFocus={() => {
          modal.remove()
        }}
      >
        <DialogHeader>
          <DialogTitle>Create bookmark</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="automatic-bookmark">
          <div className="flex w-full items-center justify-center sm:justify-start">
            <TabsList>
              <TabsTrigger value="automatic-bookmark">Automatic</TabsTrigger>
              <TabsTrigger value="manual-bookmark">Manual</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="automatic-bookmark" className="rounded-lg">
            <CreateAutomaticForm />
          </TabsContent>
          <TabsContent value="manual-bookmark" className="rounded-lg">
            <CreateManualForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
})
