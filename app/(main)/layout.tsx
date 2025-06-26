// import { Navbar } from '@/components/navbar'
// import { Sidebar } from '@/components/navigation/sidebar'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex w-full flex-1 flex-col gap-4 p-4 xl:mx-auto xl:max-w-5xl">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
