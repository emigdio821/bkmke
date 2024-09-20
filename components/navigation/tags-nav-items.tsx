import { usePathname } from 'next/navigation'
import { HashIcon, RefreshCwIcon, TagIcon } from 'lucide-react'
import { useTags } from '@/hooks/use-tags'
import { Button } from '@/components/ui/button'
import { CreateTagDialog } from '@/components/create-tag-dialog'
import { NavItemsSkeleton } from '@/components/skeletons'
import { CollapsibleGroupLabel } from './collapsible-group-label'
import { NavItem } from './nav-item'

export function TagsNavItems() {
  const pathname = usePathname()
  const { data: tags, isLoading, error } = useTags()

  if (isLoading) return <NavItemsSkeleton />

  return (
    <>
      <CollapsibleGroupLabel
        groupLabel="Tags"
        groupIcon={TagIcon}
        itemCount={tags?.length || 0}
        isActive={pathname.startsWith('/tags')}
      >
        {tags && !error && (
          <>
            {tags.length > 0 ? (
              tags.map((folder) => (
                <NavItem
                  key={`${folder.id}-tag-item`}
                  menus={[
                    {
                      href: `/tags/${folder.id}`,
                      label: folder.name,
                      active: pathname === `/tags/${folder.id}`,
                      icon: HashIcon,
                      submenus: [],
                    },
                  ]}
                />
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                <p>You have no tags yet.</p>
                <p className="flex items-center">
                  <span>Create one</span>
                  <CreateTagDialog
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
            <p>Unable to fetch tags, try again.</p>
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
