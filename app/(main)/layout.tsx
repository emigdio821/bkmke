import { AppHeader } from '@/components/app-header'
import { AppSidebar } from '@/components/app-sidebar'
import { ProfileInitializer } from '@/components/profile-initializer'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <ProfileInitializer />
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex w-full flex-1 flex-col gap-4 p-4 xl:mx-auto xl:max-w-5xl">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
