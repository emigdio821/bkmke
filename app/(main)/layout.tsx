import { AppSidebar } from '@/components/app/app-sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return <AppSidebar>{children}</AppSidebar>
}
