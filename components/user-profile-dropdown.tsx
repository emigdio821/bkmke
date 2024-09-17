import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
        <CreateFolderDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Create folder
            </DropdownMenuItem>
          }
        />
        <CreateTagDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Create tag
            </DropdownMenuItem>
          }
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void handleLogOut()
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
