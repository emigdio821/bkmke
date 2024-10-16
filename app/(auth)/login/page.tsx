import { redirect } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
        <CardDescription>
          Welcome back to <span className="font-semibold">{siteConfig.name}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
