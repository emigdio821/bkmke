import { Link, useLocation } from '@tanstack/react-router'
import {
  ChevronDownIcon,
  Edit2Icon,
  HashIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RotateCwIcon,
  Trash2Icon,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Tables } from '@/types/database.types'
import { BOOKMARKS_QUERY, FAV_BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY, TAGS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useTags } from '@/hooks/tags/use-tags'
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries'
import { useModEnabled } from '@/hooks/use-mod-enabled'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import { AlertActionDialog } from '../dialogs/alert-action'
import { CreateTagDialog } from '../dialogs/tags/create-tag'
import { EditTagDialog } from '../dialogs/tags/edit-tag'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export function NavTags() {
  const location = useLocation()
  const { pathname } = location
  const modEnabled = useModEnabled()
  const { invalidateQueries } = useInvalidateQueries()
  const { data: tags, isLoading, error, refetch } = useTags()

  async function handleDeleteTag(tag: Tables<'tags'>) {
    const supabase = createClient()
    const { error } = await supabase.from('tags').delete().eq('id', tag.id)

    if (error) {
      throw new Error(error.message)
    }

    toast.success('Success', {
      description: (
        <div>
          Tag <span className="font-semibold">{tag.name}</span> has been deleted.
        </div>
      ),
    })

    await invalidateQueries([TAGS_QUERY, BOOKMARKS_QUERY, FOLDER_ITEMS_QUERY, TAG_ITEMS_QUERY, FAV_BOOKMARKS_QUERY])
  }

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <ChevronDownIcon className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
              Tags
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CreateTagDialog
          trigger={
            <SidebarGroupAction title="Create tag">
              <PlusIcon />
              <span className="sr-only">Create tag</span>
            </SidebarGroupAction>
          }
        />
        <CollapsibleContent className="pt-1" asChild>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading &&
                Array.from(Array(4).keys()).map((n) => <SidebarMenuSkeleton key={`${n}-tags-skeleton`} showIcon />)}
              {error && (
                <SidebarMenuButton onClick={() => refetch()}>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Refetch folders</span>
                  </div>
                  <RotateCwIcon className="ml-auto size-4" />
                </SidebarMenuButton>
              )}
              {tags?.map((tag) => (
                <SidebarMenuItem key={tag.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/tags/${tag.id}`}
                    className={cn(tag.items[0].count > 0 && 'group-has-data-[sidebar=menu-action]/menu-item:pr-16')}
                  >
                    <Link to="/tags/$tagId" params={{ tagId: tag.id }}>
                      <HashIcon className="size-4" />
                      <span>{tag.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  {tag.items[0].count > 0 && (
                    <SidebarMenuBadge className="right-8">{tag.items[0].count}</SidebarMenuBadge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontalIcon />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel className="mx-2 my-1.5 line-clamp-2 p-0 wrap-break-word">
                        {tag.name}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <EditTagDialog
                        tag={tag}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit2Icon className="size-4" />
                            Edit
                          </DropdownMenuItem>
                        }
                      />
                      {modEnabled && (
                        <>
                          <DropdownMenuSeparator />
                          <AlertActionDialog
                            destructive
                            title="Delete tag?"
                            message="It will also unlik all bookmarks related to this tag. This action cannot be undone."
                            action={async () => await handleDeleteTag(tag)}
                            trigger={
                              <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2Icon className="size-4" />
                                Delete
                              </DropdownMenuItem>
                            }
                          />
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
