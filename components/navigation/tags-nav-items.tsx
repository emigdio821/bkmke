import { usePathname } from 'next/navigation'
import NiceModal from '@ebay/nice-modal-react'
import { FolderPlusIcon, HashIcon, MoreHorizontal, RefreshCwIcon, SearchCheckIcon, TagIcon } from 'lucide-react'
import { useTags } from '@/hooks/use-tags'
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
import { NavItemsSkeleton } from '@/components/skeletons'
import { NavItem } from './nav-item'

export function TagsNavItems() {
  const pathname = usePathname()
  const { data: tags, isLoading, error, refetch } = useTags()

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
      {!tags?.length ? (
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
              label: 'Tags',
              withItemCount: true,
              active: pathname.startsWith('/tags'),
              icon: TagIcon,
              actions: (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" type="button" variant="ghost">
                      <span className="sr-only">Open tags actions</span>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Tags</DropdownMenuLabel>
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
                    {tags && tags.length > 10 && (
                      <DropdownMenuItem>
                        <SearchCheckIcon className="mr-2 size-4" />
                        Toggle search
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ),

              submenus:
                (tags.length > 0 &&
                  tags.map((tag) => ({
                    href: `/tags/${tag.id}`,
                    label: tag.name,
                    // actions: <SidebarItemActions folder={folder} />,
                    active: pathname === `/tags/${tag.id}`,
                    icon: HashIcon,
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
