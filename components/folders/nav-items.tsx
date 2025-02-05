import { usePathname } from 'next/navigation'
import type { Folder, NavMenu } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import { IconFolder, IconFolderPlus, IconFolders, IconReload } from '@tabler/icons-react'
import { useFolders } from '@/hooks/folders/use-folders'
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
      <Button onClick={() => refetch()} variant="ghost" className="w-full justify-start">
        <IconReload className="mr-2 size-4" />
        Refresh folders
      </Button>
    )
  }

  function buildSubmenus(folders: Folder[]): NavMenu[] {
    return folders.map((folder) => ({
      href: `/folders/${folder.id}`,
      label: folder.name,
      actions: <SidebarItemActions folder={folder} />,
      active: pathname === `/folders/${folder.id}`,
      icon: IconFolder,
      itemCount: folder.items[0].count,
      submenus: folder.children.length > 0 ? buildSubmenus(folder.children) : [],
    }))
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
              active: pathname.startsWith('/folders'),
              icon: IconFolders,
              itemCount: folders.length,
              actions: <SidebarFoldersActions folders={folders} />,
              submenus: buildSubmenus(folders),
            },
          ]}
        />
      )}
    </>
  )
}
