import { EditDialog } from '@/components/profile/edit-dialog'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { TypographyH3 } from '@/components/ui/typography'
import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/server'
import { Avatar } from '@radix-ui/react-avatar'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

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
            <AvatarImage src={user.user_metadata.avatar} alt="User avatar" className="rounded-full size-16" />
            <AvatarFallback>
              <div className="rounded-[inherit] bg-gradient-to-r size-16 from-emerald-500 to-indigo-400" />
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="text-sm flex flex-col">
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
