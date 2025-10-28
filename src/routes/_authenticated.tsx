import { getAuthUser } from '@/server-functions/get-auth-user'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppHeader } from '@/components/app-header'
import { AppSidebar } from '@/components/app-sidebar'
import { ProfileInitializer } from '@/components/profile-initializer'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async (context) => {
    const user = await getAuthUser()

    if (!user) {
      throw redirect({
        to: '/login',
        params: context.location.href,
      })
    }

    return { user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  // const { user } = Route.useRouteContext()

  return (
    <SidebarProvider>
      <ProfileInitializer />
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <section className="flex w-full flex-1 flex-col gap-4 p-4 xl:mx-auto xl:max-w-5xl">
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
