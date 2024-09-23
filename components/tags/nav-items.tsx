import { usePathname } from 'next/navigation'
import NiceModal from '@ebay/nice-modal-react'
import { IconHash, IconReload, IconTag, IconTags } from '@tabler/icons-react'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import { CreateFolderDialog } from '@/components/dialogs/folders/create-folder'
import { NavItem } from '@/components/navigation/nav-item'
import { NavItemsSkeleton } from '@/components/skeletons'
import { SidebarTagsActions } from './sidebar-actions'
import { SidebarItemActions } from './sidebar-item-actions'

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
        <IconReload className="mr-2 size-4" />
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
          <IconTag className="mr-2 size-4" />
          Create tag
        </Button>
      ) : (
        <NavItem
          menus={[
            {
              label: 'Tags',
              withItemCount: true,
              active: pathname.startsWith('/tags'),
              icon: IconTags,
              actions: <SidebarTagsActions tags={tags} refetch={refetch} />,
              submenus: tags.map((tag) => ({
                href: `/tags/${tag.id}`,
                label: tag.name,
                actions: <SidebarItemActions tag={tag} />,
                active: pathname === `/tags/${tag.id}`,
                icon: IconHash,
                submenus: [],
              })),
            },
          ]}
        />
      )}
    </>
  )
}