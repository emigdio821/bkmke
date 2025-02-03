import { siteConfig } from '@/config/site'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { DemoPopover } from '@/components/demo-popover'
import { LoginForm } from '@/components/login/login-form'

export default function LoginPage() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Log in</CardTitle>
        <CardDescription className="flex items-center space-x-1">
          <span>
            Welcome back to <span className="font-semibold">{siteConfig.name}</span>.
          </span>
          {/* <DemoPopover /> */}
        </CardDescription>
      </CardHeader>
      <LoginForm />
    </Card>
  )
}
