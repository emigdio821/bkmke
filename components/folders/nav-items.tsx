import { usePathname } from 'next/navigation'
import NiceModal from '@ebay/nice-modal-react'
import { IconFolder, IconFolderPlus, IconFolders, IconReload } from '@tabler/icons-react'
import { useFolders } from '@/hooks/use-folders'
import { Button } from '@/components/ui/button'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { SidebarFoldersActions } from '@/components/folders/sidebar-actions'
import { SidebarItemActions } from '@/components/folders/sidebar-item-actions'
import { NavItem } from '@/components/navigation/nav-item'
import { NavItemsSkeleton } from '@/components/skeletons'

export function FoldersNavItems() {
  const pathname = usePathname()
  const { data: folders, isLoading, error, refetch } = useFolders()

  if (isLoading) return <NavItemsSkeleton />

  if (error) {
    return (
      <Button
        onClick={() => {
          void refetch()
        }}
        variant="ghost"
        className="w-full justify-start"
      >
        <IconReload className="mr-2 size-4" />
        Refresh folders
      </Button>
    )
  }

  return (
    <>
      {!folders?.length ? (
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            void NiceModal.show(CreateFolderDialog)
          }}
        >
          <IconFolderPlus className="mr-2 size-4" />
          Create folder
        </Button>
      ) : (
        <NavItem
          menus={[
            {
              label: 'Folders',
              withItemCount: true,
              active: pathname.startsWith('/folders'),
              icon: IconFolders,
              actions: <SidebarFoldersActions folders={folders} refetch={refetch} />,

              submenus:
                (folders.length > 0 &&
                  folders.map((folder) => ({
                    href: `/folders/${folder.id}`,
                    label: folder.name,
                    actions: <SidebarItemActions folder={folder} />,
                    active: pathname === `/folders/${folder.id}`,
                    icon: IconFolder,
                    submenus: [],
                  }))) ||
                [],
            },
          ]}
        />
      )}
    </>
  )
}
