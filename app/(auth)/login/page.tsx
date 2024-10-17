import { redirect } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoPopover } from '@/components/demo-popover'
import { LoginForm } from '@/components/login/login-form'

export default async function LoginPage() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  if (data.user) {
    redirect('/')
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Log in</CardTitle>
        <CardDescription className="flex items-center space-x-1">
          <span>
            Welcome back to <span className="font-semibold">{siteConfig.name}</span>.
          </span>
          <DemoPopover />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
