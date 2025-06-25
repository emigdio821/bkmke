import { usePathname } from 'next/navigation'
import { HashIcon, RotateCwIcon, TagIcon } from 'lucide-react'
import { useTags } from '@/hooks/tags/use-tags'
import { Button } from '@/components/ui/button'
import { CreateTagDialog } from '@/components/dialogs/tags/create-tag'
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
      <Button onClick={() => refetch()} variant="ghost" className="w-full justify-start">
        <RotateCwIcon className="size-4" />
        Refresh folders
      </Button>
    )
  }

  return (
    <>
      {!tags?.length ? (
        <CreateTagDialog
          trigger={
            <Button type="button" variant="ghost" className="w-full justify-start">
              <TagIcon className="size-4" />
              Create tag
            </Button>
          }
        />
      ) : (
        <NavItem
          menus={[
            {
              label: 'Tags',
              itemCount: tags.length,
              active: pathname.startsWith('/tags'),
              icon: TagIcon,
              actions: <SidebarTagsActions tags={tags} />,
              submenus: tags.map((tag) => ({
                href: `/tags/${tag.id}`,
                label: tag.name,
                actions: <SidebarItemActions tag={tag} />,
                active: pathname === `/tags/${tag.id}`,
                icon: HashIcon,
                itemCount: tag.items[0].count,
                submenus: [],
              })),
            },
          ]}
        />
      )}
    </>
  )
}
