import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  IconBookmarkPlus,
  IconBookmarks,
  IconFileImport,
  IconFolderPlus,
  IconLogout,
  IconMoonStars,
  IconReload,
  IconSelector,
  IconSettings,
  IconSun,
  IconTag,
} from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { useProfileStore } from '@/lib/stores/profile'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import { CreateBookmarkDialog } from './dialogs/bookmarks/create'
import { ImportBookmarksDialog } from './dialogs/bookmarks/import'
import { CreateFolderDialog } from './dialogs/folders/create-folder'
import { CreateTagDialog } from './dialogs/tags/create-tag'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

export function UserProfileDropdown() {
  const router = useRouter()
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { setTheme, theme } = useTheme()

  const updateProfile = useProfileStore((state) => state.updateProfile)
  const setLoadingProfile = useProfileStore((state) => state.setLoadingProfile)

  const { data: profile, isLoading, error, refetch } = useProfile()

  async function handleLogOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    queryClient.clear()
    router.push('/login')
  }

  useEffect(() => {
    if (profile) {
      updateProfile(profile)
    }
  }, [profile, updateProfile])

  useEffect(() => {
    setLoadingProfile(isLoading)
  }, [isLoading, setLoadingProfile])

  if (isLoading) return <Skeleton className="h-9" />
  if (error || !profile)
    return (
      <Button variant="outline" onClick={() => refetch()}>
        <IconReload size={16} className="mr-2" />
        Refetch profile data
      </Button>
    )

  function getProfileName() {
    if (!profile) return 'User'

    if (profile.first_name) {
      const name = profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.first_name

      return name
    }

    return profile.email || 'User'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-subtle justify-between gap-2">
          <span title={getProfileName()} className="max-w-40 truncate">
            {getProfileName()}
          </span>
          <IconSelector size={16} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="sm:w-(--radix-dropdown-menu-trigger-width)">
        <CreateFolderDialog
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <IconFolderPlus size={16} className="mr-2" />
              Create folder
            </DropdownMenuItem>
          }
        />

        <CreateTagDialog
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <IconTag className="mr-2 size-4" />
              Create tag
            </DropdownMenuItem>
          }
        />

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconBookmarks className="mr-2 size-4" />
              <span className="mr-2">Bookmarks</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <CreateBookmarkDialog
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <IconBookmarkPlus className="mr-2 size-4" />
                      Create
                    </DropdownMenuItem>
                  }
                />

                <ImportBookmarksDialog
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <IconFileImport className="mr-2 size-4" />
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
              <IconMoonStars className="hidden size-4 dark:block" />
              <IconSun className="size-4 dark:hidden" />
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
          <Link href="/settings">
            <IconSettings className="mr-2 size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogOut}>
          <IconLogout className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
