import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookmarkPlusIcon, FolderPlusIcon, LogOutIcon, PlusIcon, SettingsIcon } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import { CreateBookmarkSubmenu } from './bookmarks/create/create-bookmark-submenu'
import { CreateFolderDialog } from './create-folder-dialog'
import { CreateTagDialog } from './create-tag-dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
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
  const { data: profile, isLoading, error, refetch } = useProfile()
  const supabase = createClient()
  const router = useRouter()

  async function handleLogOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error', { description: error.message })
      return
    }

    router.push('/login')
  }

  if (isLoading) return <Skeleton className="h-9" />
  if (error || !profile)
    return (
      <Button
        variant="outline"
        onClick={() => {
          void refetch()
        }}
      >
        Refetch profile data
      </Button>
    )

  const profileNameOrEmail = profile.user_metadata.name || profile.email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between gap-2">
          <span title={profileNameOrEmail} className="max-w-40 truncate">
            {profileNameOrEmail}
          </span>

          <Avatar className="size-5">
            <AvatarImage src={profile.user_metadata.avatar || ''} />
            <AvatarFallback asChild>
              <div className="size-5 bg-gradient-to-r from-emerald-500 to-indigo-400" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <CreateTagDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <PlusIcon className="mr-2 size-4" />
              Create tag
            </DropdownMenuItem>
          }
        />
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <BookmarkPlusIcon className="mr-2 size-4" />
            Create bookmark
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <CreateBookmarkSubmenu />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <SettingsIcon className="mr-2 size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void handleLogOut()
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
