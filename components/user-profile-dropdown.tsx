import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookmarkPlusIcon, FolderPlusIcon, LogOutIcon, PlusIcon, SettingsIcon } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateTagDialog } from '@/components/create-tag-dialog'
import { CreateBookmarkDialog } from './bookmarks/create-dialog'
import { CreateFolderDialog } from './create-folder-dialog'
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{profile.user_metadata.name || profile.email}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
        <CreateBookmarkDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <BookmarkPlusIcon className="mr-2 size-4" />
              Create bookmark
            </DropdownMenuItem>
          }
        />
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
