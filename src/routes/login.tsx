import { createFileRoute } from '@tanstack/react-router'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoPopover } from '@/components/demo-popover'
import { LoginForm } from '@/components/login/login-form'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card className="m-4 mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Log in</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <span>Welcome back.</span>
          <DemoPopover />
        </CardDescription>
      </CardHeader>
      <LoginForm />
    </Card>
  )
}
