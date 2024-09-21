import { usePathname } from 'next/navigation'
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
import { CreateFolderDialog } from '@/components/create-folder-dialog'
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
        <CreateFolderDialog
          trigger={
            <Button variant="ghost" className="w-full justify-start">
              <FolderPlusIcon className="mr-2 size-4" />
              Create folder
            </Button>
          }
        />
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
                    <CreateFolderDialog
                      trigger={
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault()
                          }}
                        >
                          <FolderPlusIcon className="mr-2 size-4" />
                          Create folder
                        </DropdownMenuItem>
                      }
                    />
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
