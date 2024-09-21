import { usePathname } from 'next/navigation'
import NiceModal from '@ebay/nice-modal-react'
import { FolderIcon, FolderPlusIcon, FoldersIcon, MoreHorizontal, RefreshCwIcon, SearchCheckIcon } from 'lucide-react'
import { useFolders } from '@/hooks/use-folders'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { SidebarItemActions } from '@/components/folders/sidebar-item-actions'
import { NavItemsSkeleton } from '@/components/skeletons'
import { NavItem } from './nav-item'

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
        <RefreshCwIcon className="mr-2 size-4" />
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
          <FolderPlusIcon className="mr-2 size-4" />
          Create folder
        </Button>
      ) : (
        <NavItem
          menus={[
            {
              label: 'Folders',
              withItemCount: true,
              active: pathname.startsWith('/folders'),
              icon: FoldersIcon,
              actions: (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" type="button" variant="ghost">
                      <span className="sr-only">Open folders actions</span>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Folders</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        void NiceModal.show(CreateFolderDialog)
                      }}
                    >
                      <FolderPlusIcon className="mr-2 size-4" />
                      Create folder
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onSelect={() => {
                        void refetch()
                      }}
                    >
                      <RefreshCwIcon className="mr-2 size-4" />
                      Reload data
                    </DropdownMenuItem>
                    {folders && folders.length > 10 && (
                      <DropdownMenuItem>
                        <SearchCheckIcon className="mr-2 size-4" />
                        Toggle search
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ),

              submenus:
                (folders.length > 0 &&
                  folders.map((folder) => ({
                    href: `/folders/${folder.id}`,
                    label: folder.name,
                    actions: <SidebarItemActions folder={folder} />,
                    active: pathname === `/folders/${folder.id}`,
                    icon: FolderIcon,
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
