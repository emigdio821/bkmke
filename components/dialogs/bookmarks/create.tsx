'use client'

import { useDialogStore } from '@/lib/stores/dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateAutomaticForm } from '@/components/bookmarks/create-automatic-form'
import { CreateManualForm } from '@/components/bookmarks/create-manual-form'

export function CreateBookmarkDialog({ trigger }: { trigger: React.ReactNode }) {
  const open = useDialogStore((state) => state.open)
  const toggle = useDialogStore((state) => state.toggle)
  const isLoading = useDialogStore((state) => state.isLoading)

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isLoading) return
        toggle(isOpen)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-0">
          <DialogTitle>Create bookmark</DialogTitle>
          <DialogDescription className="sr-only">Create bookmark dialog</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="automatic-bookmark" className="flex h-full flex-col overflow-y-auto pt-4">
          <div className="flex w-full items-center justify-center px-4 sm:justify-start">
            <TabsList>
              <TabsTrigger value="automatic-bookmark">Automatic</TabsTrigger>
              <TabsTrigger value="manual-bookmark">Manual</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="automatic-bookmark" className="flex h-full flex-col overflow-y-auto rounded-md">
            <CreateAutomaticForm />
          </TabsContent>
          <TabsContent value="manual-bookmark" className="flex h-full flex-col overflow-y-auto rounded-md">
            <CreateManualForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
