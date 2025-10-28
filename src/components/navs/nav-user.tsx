import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  BookmarkIcon,
  BookmarkPlusIcon,
  ChevronsUpDownIcon,
  FileUpIcon,
  FolderPlusIcon,
  LogOutIcon,
  MoonIcon,
  RotateCwIcon,
  SettingsIcon,
  SunIcon,
  TagIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { CreateBookmarkDialog } from '../dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '../dialogs/bookmarks/import'
import { CreateFolderDialog } from '../dialogs/folders/create-folder'
import { CreateTagDialog } from '../dialogs/tags/create-tag'
import { Skeleton } from '../ui/skeleton'

export function NavUser() {
  const theme = 'system'
  const navigate = useNavigate()
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { data: profile, isLoading, error, refetch } = useProfile()

  async function handleLogOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    queryClient.clear()
    navigate({ to: '/login' })
  }

  if (isLoading) return <Skeleton className="h-8" />

  if (error || !profile)
    return (
      <SidebarMenuButton onClick={() => refetch()}>
        <Avatar className="size-5">
          <AvatarImage src="" />
          <AvatarFallback />
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">Refetch profile</span>
        </div>
        <RotateCwIcon className="ml-auto size-4" />
      </SidebarMenuButton>
    )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="size-5">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{profile.first_name}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="sm:w-(--radix-dropdown-menu-trigger-width)" align="start">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar>
                  <AvatarImage src={profile.avatar_url || ''} />
                  <AvatarFallback />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{profile.first_name}</span>
                  <span className="text-muted-foreground truncate text-xs">{profile.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <CreateFolderDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <FolderPlusIcon className="size-4" />
                    Create folder
                  </DropdownMenuItem>
                }
              />

              <CreateTagDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <TagIcon className="size-4" />
                    Create tag
                  </DropdownMenuItem>
                }
              />

              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <BookmarkIcon className="text-muted-foreground mr-2 size-4" />
                    Bookmarks
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <CreateBookmarkDialog
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <BookmarkPlusIcon className="size-4" />
                            Create
                          </DropdownMenuItem>
                        }
                      />

                      <ImportBookmarksDialog
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <FileUpIcon className="size-4" />
                            Import
                          </DropdownMenuItem>
                        }
                      />
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <MoonIcon className="text-muted-foreground hidden size-4 dark:block" />
                    <SunIcon className="text-muted-foreground size-4 dark:hidden" />
                    <span className="ml-2">Appearance</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuCheckboxItem checked={theme === 'light'} onClick={() => setTheme('light')}>
                        Light
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={theme === 'dark'} onClick={() => setTheme('dark')}>
                        Dark
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={theme === 'system'} onClick={() => setTheme('system')}>
                        System
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <SettingsIcon className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogOut}>
              <LogOutIcon className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
