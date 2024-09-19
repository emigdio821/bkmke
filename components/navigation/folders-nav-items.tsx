import { usePathname } from 'next/navigation'
import { FolderIcon, FoldersIcon, RefreshCwIcon } from 'lucide-react'
import { useFolders } from '@/hooks/use-folders'
import { Button } from '@/components/ui/button'
import { CreateFolderDialog } from '@/components/create-folder-dialog'
import { NavItemsSkeleton } from '@/components/skeletons'
import { CollapsibleGroupLabel } from './collapsible-group-label'
import { NavItem } from './nav-item'

export function FoldersNavItems() {
  const pathname = usePathname()
  const { data: folders, isLoading, error } = useFolders()

  if (isLoading) return <NavItemsSkeleton />

  return (
    <>
      <CollapsibleGroupLabel groupIcon={FoldersIcon} groupLabel="Folders" itemCount={folders?.length || 0}>
        {folders && !error && (
          <>
            {folders.length > 0 ? (
              folders.map((folder) => (
                <NavItem
                  key={`${folder.id}-tag-item`}
                  menus={[
                    {
                      href: `/folders/${folder.id}`,
                      label: folder.name,
                      active: pathname === `/folders/${folder.id}`,
                      icon: FolderIcon,
                      submenus: [],
                    },
                  ]}
                />
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                <p>You have no folders yet.</p>
                <p className="flex items-center">
                  <span>Create one</span>
                  <CreateFolderDialog
                    trigger={
                      <Button variant="underlineLink" className="ml-1">
                        here
                      </Button>
                    }
                  />
                  .
                </p>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            <p>Unable to fetch folders, try again.</p>
            <p className="flex items-center">
              <Button variant="link">
                Refetch <RefreshCwIcon className="ml-2 size-4" />
              </Button>
            </p>
          </div>
        )}
      </CollapsibleGroupLabel>
    </>
  )
}
