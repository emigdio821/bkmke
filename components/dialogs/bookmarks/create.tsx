'use client'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateAutomaticForm } from '@/components/bookmarks/create-automatic-form'
import { CreateManualForm } from '@/components/bookmarks/create-manual-form'

export const CreateBookmarkDialog = NiceModal.create(() => {
  const modal = useModal()

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        isOpen ? modal.show() : modal.hide()
      }}
    >
      <DialogContent onCloseAutoFocus={() => modal.remove()}>
        <DialogHeader className="space-y-0">
          <DialogTitle>Create bookmark</DialogTitle>
          <DialogDescription className="sr-only">Create bookmark dialog</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="automatic-bookmark" className="mt-4">
          <div className="flex w-full items-center justify-center px-4 sm:justify-start">
            <TabsList>
              <TabsTrigger value="automatic-bookmark">Automatic</TabsTrigger>
              <TabsTrigger value="manual-bookmark">Manual</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="automatic-bookmark" className="rounded-md">
            <CreateAutomaticForm />
          </TabsContent>
          <TabsContent value="manual-bookmark" className="rounded-md">
            <CreateManualForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
})
