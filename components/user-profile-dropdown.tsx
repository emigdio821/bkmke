import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NiceModal from '@ebay/nice-modal-react'
import { IconBookmarkPlus, IconLogout, IconPlus, IconSettings } from '@tabler/icons-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import { CreateBookmarkDialog } from './dialogs/bookmarks/create'
import { CreateTagDialog } from './dialogs/tags/create-tag'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(CreateTagDialog)
          }}
        >
          <IconPlus className="mr-2 size-4" />
          Create tag
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            void NiceModal.show(CreateBookmarkDialog)
          }}
        >
          <IconBookmarkPlus className="mr-2 size-4" />
          Create bookmark
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <IconSettings className="mr-2 size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void handleLogOut()
          }}
        >
          <IconLogout className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
