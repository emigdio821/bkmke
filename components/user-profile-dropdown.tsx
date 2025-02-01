import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NiceModal from '@ebay/nice-modal-react'
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
  const { data: profile, isLoading, error, refetch } = useProfile()
  const userMetadata = profile?.user_metadata

  async function handleLogOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    queryClient.clear()
    router.push('/login')
  }

  if (isLoading) return <Skeleton className="h-9" />
  if (error || !profile)
    return (
      <Button variant="outline" onClick={() => refetch()}>
        <IconReload size={16} className="mr-2" />
        Refetch profile data
      </Button>
    )

  const profileNameOrEmail = userMetadata?.name || profile.email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-subtle justify-between gap-2">
          <span title={profileNameOrEmail} className="max-w-40 truncate">
            {profileNameOrEmail}
          </span>
          <IconSelector size={16} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="sm:w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuItem onSelect={() => NiceModal.show(CreateFolderDialog)}>
          <IconFolderPlus size={16} className="mr-2" />
          Create folder
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => NiceModal.show(CreateTagDialog)}>
          <IconTag className="mr-2 size-4" />
          Create tag
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconBookmarks className="mr-2 size-4" />
              <span className="mr-2">Bookmarks</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => NiceModal.show(CreateBookmarkDialog)}>
                  <IconBookmarkPlus className="mr-2 size-4" />
                  Create
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => NiceModal.show(ImportBookmarksDialog)}>
                  <IconFileImport className="mr-2 size-4" />
                  Import
                </DropdownMenuItem>
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
        <DropdownMenuItem onClick={handleLogOut}>
          <IconLogout className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
