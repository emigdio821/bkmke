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
        <DialogHeader>
          <DialogTitle>Create bookmark</DialogTitle>
          <DialogDescription className="sr-only">Create bookmark dialog</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="automatic-bookmark">
          <TabsList>
            <TabsTrigger value="automatic-bookmark">Automatic</TabsTrigger>
            <TabsTrigger value="manual-bookmark">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="automatic-bookmark">
            <CreateAutomaticForm />
          </TabsContent>
          <TabsContent value="manual-bookmark">
            <CreateManualForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
