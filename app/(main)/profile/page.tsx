import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Avatar } from '@radix-ui/react-avatar'
import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/server'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { TypographyH3 } from '@/components/ui/typography'
import { EditDialog } from '@/components/profile/edit-dialog'

export const metadata: Metadata = {
  title: {
    default: 'Profile',
    template: `%s · ${siteConfig.name}`,
  },
}

export default async function ProfilePage() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) redirect('/login')
  const user = data.user

  return (
    <>
      <TypographyH3>Profile</TypographyH3>
      <Card className="mt-4">
        <CardHeader className="items-start">
          <Avatar>
            <AvatarImage src={user.user_metadata.avatar} alt="User avatar" className="size-16 rounded-full" />
            <AvatarFallback>
              <div className="size-16 rounded-[inherit] bg-gradient-to-r from-emerald-500 to-indigo-400" />
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="flex flex-col text-sm">
          {user.user_metadata.name && (
            <span>
              <span className="text-muted-foreground">Name: </span>
              <span>{user.user_metadata.name}</span>
            </span>
          )}
          <span>
            <span className="text-muted-foreground">Email: </span>
            <span>{user.email}</span>
          </span>
          <span>
            <span className="text-muted-foreground">Created at: </span>
            <span>{new Date(user.created_at).toUTCString()}</span>
          </span>
          {user.updated_at && (
            <span>
              <span className="text-muted-foreground">Updated at: </span>
              <span>{new Date(user.updated_at).toUTCString()}</span>
            </span>
          )}
          <span>
            <span className="text-muted-foreground">Provider: </span>
            <span>{user.app_metadata.provider}</span>
          </span>
        </CardContent>
        <CardFooter>
          <EditDialog user={user} />
        </CardFooter>
      </Card>
    </>
  )
}
